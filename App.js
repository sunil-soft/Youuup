/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import { useEffect, useState } from "react";
import "react-native-gesture-handler";
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
import Intro from "@/screens/Intro/intro";
import { Platform } from 'react-native';

import PushNotification from 'react-native-push-notification';

//import { notifee } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from "@react-native-firebase/app";
import messaging from '@react-native-firebase/messaging';
import RNBootSplash, { hide } from "react-native-bootsplash";
import FlashMessage from "react-native-flash-message";
import SplashScreen from 'react-native-splash-screen';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RootNavigator } from "./src/navigation";
import { persistor, store } from "./src/store";
const App = () => {
  const [isSplash, SetSplash] = useState(true);
  const [isFirstTimeLoad, setIsFirstTimeLoad] = useState(1);


  useEffect(() => {

    //  firebase.initializeApp(config)
    // firebase.initializeApp()
    checkForFirstTimeLoaded();
    SplashScreen.hide();

  }, []);

  useEffect(async () => {

    let config = {
      apiKey: "AIzaSyArq06zeNfjnR-8yCth96HWLKKsKVxvTt0",
      appId: "1:941329630258:android:1d083a9a8a23d5b049282b",
      authDomain: "",
      databaseURL: "",
      projectId: "youuup-4179a",
      storageBucket: "",
      messagingSenderId: "941329630258"
    };
    console.log(firebase.apps.length)
    //if (firebase.apps.length > 0) {
    // await firebase.initializeApp(config);
    // } else {
    // await firebase.app(); // if already initialized, use that one
    // }
  }, []);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      if (Platform.OS === 'android') {
        // displayNotification(remoteMessage);
      }
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    const unsubscribe2 = messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      //  playSampleSound('bell');
      // onDisplayNotification()
      if (Platform.OS === 'android') {
        // displayNotification(remoteMessage);
      }

      PushNotification.configure({
        onRegister: function (token) {
          console.log('TOKEN:', token);

          PushNotification.createChannel(
            {
              channelId: 'default-channel-id', // (required)
              channelName: `Default channel`, // (required)
              channelDescription: 'A default channel', // (optional) default: undefined.
              soundName: 'ringbell',
              playSound: true, // (optional) See `soundName` parameter of `localNotification` function
              importance: 4, // (optional) default: 4. Int value of the Android notification importance
              vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            },
            created =>
              console.log(
                `createChannel 'default-channel-id' returned '${created}'`,
              ), // (optional) callback returns whether the channel was created, false means it already existed.
          );
        },

        // (required) Called when a remote is received or opened, or local notification is opened
        onNotification: function (notification) {
          // alert(JSON.stringify(notification));
          // return;
          console.log('NOTIFICATION DATA---:', notification);

          // AsyncStorage.getItem('notificationType').then(val => {
          //   console.log('notificationType ===>>', typeof val);
          //   if (val === 'chat') {
          //     RootNavigation.navigate('Chat');
          //   } else {
          //     RootNavigation.navigate('Notification');
          //   }
          // });
          //  notification.finish(PushNotificationIOS.FetchResult.NoData);
          // dispatch(getNotificationData(notification.data));
        },

        onAction: function (notification) {
          console.log('ACTION:', notification.action);
          console.log('NOTIFICATION:', notification);
        },

        onRegistrationError: function (err) {
          console.error(err.message, err);
        },

        senderID: '344834496734',

        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,
        requestPermissions: true,
      });
    });

    return unsubscribe2;
  }, []);
  const displayNotification = async notificationData => {
    console.log('Notifications===>>>', notificationData.notification);

    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: 'default-channel-id',
      priority: 'high', // (optional) set notification priority, default: high
      visibility: 'private', // (optional) set notification visibility, default: private
      ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
      shortcutId: 'shortcut-id', // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
      // onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
      // smallIcon: 'ic_notification',
      //  when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      // usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
      //timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

      //  invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

      /* iOS only properties */
      //alertAction: 'view', // (optional) default: view
      category: '', // (optional) default: empty string
      //  userInfo: notificationData, // (optional) default: {} (using null throws a JSON value '<null>' error)
      // userInfo: { ...notificationData }, // (optional) default: {} (using null throws a JSON value '<null>' error)

      /* iOS and Android properties */
      title: 'gfgf', // (optional)
      message: notificationData.notification.body, // (required)
      playSound: true, // (optional) default: true
      soundName: 'mix_noti.wav', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      // number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    });
  };


  // async function onDisplayNotification() {
  //   // Request permissions (required for iOS)
  //   await notifee.requestPermission()

  //   // Create a channel (required for Android)
  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //   });

  //   // Display a notification
  //   await notifee.displayNotification({
  //     title: 'Notification Title',
  //     body: 'Main body content of the notification',
  //     android: {
  //       channelId,
  //       smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
  //       // pressAction is needed if you want the notification to open the app when pressed
  //       pressAction: {
  //         id: 'default',
  //       },
  //     },
  //   });
  // }

  const checkForFirstTimeLoaded = async () => {
    const result = await AsyncStorage.getItem('isFirstTimeOpen');
    if (result == null) {
      setIsFirstTimeLoad(2);
    }
    else {
      setIsFirstTimeLoad(1);
    }
  };
  useEffect(() => {
  }, []);
  useEffect(() => {

    setTimeout(() => {
      RNBootSplash.hide();
      SetSplash(false);

    }, 2000);
  }, []);
  const _onDone = () => {
    AsyncStorage.setItem('isFirstTimeOpen', 'no')
    setIsFirstTimeLoad(1)
  }
  return (
    <Provider store={store}>
      <PersistGate onBeforeLift={hide} persistor={persistor}>
        {isFirstTimeLoad == 1 ?
          //  isSplash ?<Splash /> : <RootNavigator />
          <RootNavigator />

          :
          null
        }
        {
          isFirstTimeLoad == 2 ?
            // isSplash  ? <Splash />:<Intro onDone={_onDone}/>
            <Intro onDone={_onDone} />

            :
            null

        }
      </PersistGate>
      <FlashMessage
        style={{ paddingTop: 32 }}
        position="top"
      />
    </Provider>
  );
};

export default App;
