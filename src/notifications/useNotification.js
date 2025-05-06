// import { useEffect } from "react"
// import { PermissionsAndroid } from 'react-native';
// import { getMessaging, getToken } from '@react-native-firebase/messaging';

// // const messaging = getMessaging();
// // getToken(messaging, { vapidKey: 'BHd9VenUtSYVFeaGaGB_KhZZFuBNVeQtL-WAwvlFRovz48v2zc0-xiduabh_H5wIi9z5WJG1mHjr34JeCkymBcs' }).then((currentToken) => {
// //   if (currentToken) {
// //     // Send the token to your server and update the UI if necessary
// //     // ...
// //   } else {
// //     // Show permission request UI
// //     console.log('No registration token available. Request permission to generate one.');
// //     // ...
// //   }
// // }).catch((err) => {
// //   console.log('An error occurred while retrieving token. ', err);
// //   // ...
// // });
// const requestUserPermission = async () => {
//     const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log("You can use the notifications");
//     } else {
//         console.log("Notification permission denied");
//     }
// }

// const GetToken = async () => {
//     try {
//         const messaging = getMessaging();
//         const token = await getToken(messaging, { vapidKey: 'BHd9VenUtSYVFeaGaGB_KhZZFuBNVeQtL-WAwvlFRovz48v2zc0-xiduabh_H5wIi9z5WJG1mHjr34JeCkymBcs' });
//         console.log("FCM Token: ", token);
//     } catch (error) {
//         console.error("Error getting FCM token: ", error);
//     }
// }

// export const useNotification = () => {
//     useEffect(() => {
//         requestUserPermission();
//         GetToken();
//     }, []);
// }