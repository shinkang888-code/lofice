package com.lofice.app;

import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.provider.Settings;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import com.getcapacitor.BridgeActivity;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        bridge.getWebView().addJavascriptInterface(new LoficeBridge(), "LoficeAndroid");
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
        if (!Intent.ACTION_VIEW.equals(action) && !Intent.ACTION_SEND.equals(action)) return;

        Uri uri = intent.getData();
        if (uri == null && intent.getExtras() != null) {
            Object stream = intent.getExtras().get(Intent.EXTRA_STREAM);
            if (stream instanceof Uri) uri = (Uri) stream;
        }
        if (uri == null) return;

        final Uri fileUri = uri;
        final String fileName = resolveFileName(fileUri);

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
                dispatchFileToWeb(fileName, base64);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, 1200);
    }

    private void dispatchFileToWeb(String fileName, String base64) {
        String safeName = fileName.replace("\\", "\\\\").replace("'", "\\'");
        String js = String.format(
            "window.dispatchEvent(new CustomEvent('lofice:openFile', {detail: {name: '%s', data: '%s'}}));",
            safeName, base64
        );
        bridge.getWebView().evaluateJavascript(js, null);
    }

    private String resolveFileName(Uri uri) {
        String name = null;
        if ("content".equals(uri.getScheme())) {
            try (Cursor cursor = getContentResolver().query(uri, null, null, null, null)) {
                if (cursor != null && cursor.moveToFirst()) {
                    int idx = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                    if (idx >= 0) name = cursor.getString(idx);
                }
            } catch (Exception ignored) { }
        }
        if (name == null) {
            String path = uri.getLastPathSegment();
            if (path != null) {
                int slash = path.lastIndexOf('/');
                name = slash >= 0 ? path.substring(slash + 1) : path;
            }
        }
        return name != null && !name.isEmpty() ? name : "document";
    }

    public class LoficeBridge {
        @JavascriptInterface
        public void openDefaultAppSettings() {
            runOnUiThread(() -> {
                try {
                    Intent intent = new Intent(Settings.ACTION_MANAGE_DEFAULT_APPS_SETTINGS);
                    startActivity(intent);
                } catch (Exception e) {
                    try {
                        startActivity(new Intent(Settings.ACTION_SETTINGS));
                    } catch (Exception ignored) { }
                }
            });
        }
    }
}
