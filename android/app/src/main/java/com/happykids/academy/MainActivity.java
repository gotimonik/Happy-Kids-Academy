package com.happykids.academy;

import android.graphics.Color;
import android.graphics.Rect;
import android.os.Build;
import android.os.Bundle;
import android.view.View;

import androidx.annotation.RequiresApi;

import com.getcapacitor.BridgeActivity;

import java.util.Collections;

public class MainActivity extends BridgeActivity {
    /**
     * Width of the left-edge strip the web app treats as the start of an
     * "open the menu" swipe — must match `EDGE_ZONE_PX` in
     * src/components/shared/mobile-nav-drawer.tsx (WebView CSS px == dp).
     */
    private static final int EDGE_SWIPE_WIDTH_DP = 24;

    /**
     * Android honors at most 200dp of gesture exclusion per screen edge, so
     * this is the tallest band the app can claim from the system Back
     * gesture.
     */
    private static final int EDGE_SWIPE_HEIGHT_DP = 200;

    /** Matches Tailwind's `md` breakpoint, where the swipe-open drawer is replaced by the always-visible SideNav. */
    private static final int DRAWER_MAX_WIDTH_DP = 768;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NativeTTSPlugin.class);
        super.onCreate(savedInstanceState);

        View webView = getBridge().getWebView();

        // Matches the launch splash's background (see capacitor.config.ts /
        // styles.xml's splash theme) so there's no flash of the WebView's
        // default white in the moment between the splash lifting and the
        // page actually finishing its first paint.
        webView.setBackgroundColor(Color.parseColor("#BAD2DD"));

        // With gesture navigation (Android 10+), a swipe in from the left
        // edge is the system Back gesture and never reaches the WebView, so
        // the web app's swipe-from-the-edge-to-open-the-menu gesture can't
        // work there. Exclude a band in the middle of the left edge from the
        // Back gesture so that swipe reaches the page instead; Back still
        // works from the rest of the left edge and the whole right edge.
        // Re-applied on every layout change (rotation, split screen, resize).
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            webView.addOnLayoutChangeListener(
                (view, left, top, right, bottom, oldLeft, oldTop, oldRight, oldBottom) -> updateEdgeSwipeExclusion(view)
            );
        }
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    private void updateEdgeSwipeExclusion(View view) {
        float density = getResources().getDisplayMetrics().density;
        int width = view.getWidth();
        int height = view.getHeight();
        if (width == 0 || height == 0) return;

        // Wide layouts show the SideNav instead of the drawer — nothing to
        // swipe open, so leave the system Back gesture fully intact.
        if (width / density >= DRAWER_MAX_WIDTH_DP) {
            view.setSystemGestureExclusionRects(Collections.emptyList());
            return;
        }

        int bandWidth = Math.round(EDGE_SWIPE_WIDTH_DP * density);
        int bandHeight = Math.min(height, Math.round(EDGE_SWIPE_HEIGHT_DP * density));
        int bandTop = (height - bandHeight) / 2;
        view.setSystemGestureExclusionRects(
            Collections.singletonList(new Rect(0, bandTop, bandWidth, bandTop + bandHeight))
        );
    }
}
