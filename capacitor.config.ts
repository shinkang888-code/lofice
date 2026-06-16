import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lofice.app",
  appName: "lofice",
  webDir: "out",
  server: { androidScheme: "https" },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#003377",
      showSpinner: false,
      androidSplashResourceName: "splash",
    },
    StatusBar: { style: "LIGHT", backgroundColor: "#003377" },
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
