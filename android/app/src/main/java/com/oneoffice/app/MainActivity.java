package com.oneoffice.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import com.getcapacitor.BridgeActivity;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import android.util.Base64;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIntent(intent);
    }

    private void handleIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        if (Intent.ACTION_VIEW.equals(action) || Intent.ACTION_SEND.equals(action)) {
            Uri uri = intent.getData();
            if (uri == null && intent.getExtras() != null) {
                Object stream = intent.getExtras().get(Intent.EXTRA_STREAM);
                if (stream instanceof Uri) uri = (Uri) stream;
            }
            if (uri != null) {
                final Uri fileUri = uri;
                final String fileName = getFileName(fileUri);
                bridge.getWebView().postDelayed(() -> {
                    try {
                        InputStream is = getContentResolver().openInputStream(fileUri);
                        if (is == null) return;
                        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
                        byte[] data = new byte[8192];
                        int n;
                        while ((n = is.read(data)) != -1) buffer.write(data, 0, n);
                        is.close();
                        String base64 = Base64.encodeToString(buffer.toByteArray(), Base64.NO_WRAP);
                        String js = String.format(
                            "window.dispatchEvent(new CustomEvent('oneoffice:openFile', {detail: {name: '%s', data: '%s'}}));",
                            fileName.replace("'", "\\'"), base64
                        );
                        bridge.getWebView().evaluateJavascript(js, null);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }, 1500);
            }
        }
    }

    private String getFileName(Uri uri) {
        String path = uri.getLastPathSegment();
        if (path != null) return path;
        return "document";
    }
}
