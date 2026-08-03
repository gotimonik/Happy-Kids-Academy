package com.happykids.academy;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@CapacitorPlugin(name = "NativeTTS")
public class NativeTTSPlugin extends Plugin {
    private static final String TAG = "NativeTTS";

    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private final List<Runnable> pendingActions = new ArrayList<>();
    private final Map<String, PluginCall> activeCalls = new HashMap<>();
    private final AudioManager.OnAudioFocusChangeListener audioFocusChangeListener = focusChange -> {
    };

    private AudioFocusRequest audioFocusRequest;
    private AudioManager audioManager;
    private TextToSpeech textToSpeech;
    private boolean isReady = false;
    private boolean didFailInit = false;

    @Override
    public void load() {
        audioManager = (AudioManager) getContext().getSystemService(Context.AUDIO_SERVICE);

        mainHandler.post(() -> textToSpeech = new TextToSpeech(getContext(), status -> {
            if (status == TextToSpeech.SUCCESS) {
                isReady = true;
                configureTextToSpeech();
            } else {
                didFailInit = true;
            }

            flushPendingActions();
        }));
    }

    @PluginMethod
    public void speak(PluginCall call) {
        String text = call.getString("text", "").trim();

        if (text.isEmpty()) {
            call.resolve();
            return;
        }

        runWhenReady(call, () -> {
            String localeTag = call.getString("locale", "en-US");
            double pitch = call.getDouble("pitch", 1.0);
            double rate = call.getDouble("rate", 0.95);

            Log.d(TAG, "speak text=\"" + text + "\" locale=" + localeTag);

            Locale locale = Locale.forLanguageTag(localeTag);

            textToSpeech.stop();

            int languageResult = textToSpeech.setLanguage(locale);

            if (languageResult == TextToSpeech.LANG_MISSING_DATA
                    || languageResult == TextToSpeech.LANG_NOT_SUPPORTED) {
                Log.w(TAG, "Language unavailable, using default voice: " + localeTag);
                textToSpeech.setLanguage(Locale.US);
            }

            textToSpeech.setPitch((float) pitch);
            textToSpeech.setSpeechRate((float) rate);

            String utteranceId = "hka-" + System.currentTimeMillis();
            String spokenText = text.length() <= 4 ? text + "." : text;

            requestAudioFocus();

            resolveActiveCalls();
            activeCalls.put(utteranceId, call);
            int result = textToSpeech.speak(spokenText, TextToSpeech.QUEUE_FLUSH, null, utteranceId);

            if (result != TextToSpeech.SUCCESS) {
                activeCalls.remove(utteranceId);
                abandonAudioFocus();
                call.reject("Unable to start TextToSpeech.");
            }
        });
    }

    @PluginMethod
    public void stop(PluginCall call) {
        mainHandler.post(() -> {
            if (textToSpeech != null) {
                textToSpeech.stop();
            }

            resolveActiveCalls();
            abandonAudioFocus();

            JSObject ret = new JSObject();
            ret.put("stopped", true);
            call.resolve(ret);
        });
    }

    @Override
    protected void handleOnDestroy() {
        mainHandler.post(() -> {
            if (textToSpeech != null) {
                textToSpeech.stop();
                textToSpeech.shutdown();
                textToSpeech = null;
            }

            activeCalls.clear();
            abandonAudioFocus();
        });
    }

    private void configureTextToSpeech() {
        textToSpeech.setAudioAttributes(new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ASSISTANCE_ACCESSIBILITY)
                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                .build());

        textToSpeech.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override
            public void onStart(String utteranceId) {
                Log.d(TAG, "started utterance=" + utteranceId);
            }

            @Override
            public void onDone(String utteranceId) {
                finishUtterance(utteranceId, null);
            }

            @Override
            public void onError(String utteranceId) {
                finishUtterance(utteranceId, "TextToSpeech failed.");
            }

            @Override
            public void onError(String utteranceId, int errorCode) {
                finishUtterance(utteranceId, "TextToSpeech failed with code: " + errorCode);
            }

            @Override
            public void onStop(String utteranceId, boolean interrupted) {
                finishUtterance(utteranceId, null);
            }
        });
    }

    private void resolveActiveCalls() {
        for (PluginCall activeCall : new ArrayList<>(activeCalls.values())) {
            activeCall.resolve();
        }

        activeCalls.clear();
    }

    private void finishUtterance(String utteranceId, String errorMessage) {
        mainHandler.post(() -> {
            PluginCall call = activeCalls.remove(utteranceId);

            if (call != null) {
                if (errorMessage == null) {
                    call.resolve();
                } else {
                    call.reject(errorMessage);
                }
            }

            if (activeCalls.isEmpty()) {
                abandonAudioFocus();
            }
        });
    }

    private void requestAudioFocus() {
        if (audioManager == null) {
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            audioFocusRequest = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK)
                    .setAudioAttributes(new AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_ASSISTANCE_ACCESSIBILITY)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                            .build())
                    .setOnAudioFocusChangeListener(audioFocusChangeListener)
                    .build();

            audioManager.requestAudioFocus(audioFocusRequest);
            return;
        }

        audioManager.requestAudioFocus(
                audioFocusChangeListener,
                AudioManager.STREAM_MUSIC,
                AudioManager.AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK
        );
    }

    private void abandonAudioFocus() {
        if (audioManager == null) {
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && audioFocusRequest != null) {
            audioManager.abandonAudioFocusRequest(audioFocusRequest);
            audioFocusRequest = null;
            return;
        }

        audioManager.abandonAudioFocus(audioFocusChangeListener);
    }

    private void runWhenReady(PluginCall call, Runnable action) {
        mainHandler.post(() -> {
            if (didFailInit) {
                call.reject("TextToSpeech failed to initialize.");
                return;
            }

            if (isReady && textToSpeech != null) {
                action.run();
                return;
            }

            pendingActions.add(() -> {
                if (didFailInit || textToSpeech == null) {
                    call.reject("TextToSpeech failed to initialize.");
                    return;
                }

                action.run();
            });
        });
    }

    private void flushPendingActions() {
        mainHandler.post(() -> {
            List<Runnable> actions = new ArrayList<>(pendingActions);
            pendingActions.clear();

            for (Runnable action : actions) {
                action.run();
            }
        });
    }
}
