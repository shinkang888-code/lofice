import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.oneoffice.app",
  appName: "OneOffice",
  webDir: "out",
  server: { androidScheme: "https" },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2563eb",
      showSpinner: false,
    },
    StatusBar: { style: "LIGHT", backgroundColor: "#2563eb" },
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
