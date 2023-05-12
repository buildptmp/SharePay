# SharePay
Follow these steps to setting up react native environment

1. Install Android Studio.
via https://developer.android.com/studio

2. Install Nodejs.
via https://nodejs.org/en.
The recommended version is fine.

3. Install Java JDK 11.
via https://www.oracle.com/java/technologies/downloads/#java11-windows.
Please select `x64 Installer`.

4. Install Android SDK Platforms and SDK Tools.

5. Configure the `ANDROID_HOME` and `platform-tool` environment variable.
For the step 4 and 5, please follow the guidelines the steps 2 to 4 from https://reactnative.dev/docs/0.70/environment-setup?guide=native.

* One more environment variable that needed to be set it up, is `JAVA_HOME`. Under system variable, If you have not had JAVA_HOME, click new, and name it `JAVA_HOME`. And the value, basically the JDK path is `C:\Program Files\Java\jdk-%your installed version%`. For example, `C:\Program Files\Java\jdk-17.0.1`.

6. Create an emulator in Android Studio.
via https://developer.android.com/studio/run/managing-avds. 
Please choose API level 30 or 31, besides that, choose as you like.

7. Download the SharePay zip, extract those files, and then the SharePay project is ready to build and run.

How to build and run the project

* Open the terminal, run `npm install` and wait for a second to have `node_modules` in the project, and then run `npx react-native run-android` to build and start the application and the emulator.
