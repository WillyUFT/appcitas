import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.appcitas',
  appName: 'App citas',
  webDir: 'www',
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000',
      AndroidWindowSplashScreenAnimatedIcon: 'res://icon'
    }
  },

  plugins: {
    CapacitorSQLite: {
      androidDatabaseLocation: 'default',
    }
  }

};

export default config;
