package com.happykids.academy;

import android.graphics.Color;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NativeTTSPlugin.class);
        super.onCreate(savedInstanceState);

        // Matches the launch splash's background (see capacitor.config.ts /
        // styles.xml's splash theme) so there's no flash of the WebView's
        // default white in the moment between the splash lifting and the
        // page actually finishing its first paint.
        getBridge().getWebView().setBackgroundColor(Color.parseColor("#BAD2DD"));
    }
}
