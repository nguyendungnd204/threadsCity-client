import { database } from '../../firebase';
import notifee from '@notifee/react-native';

export async function displayNotification(userId, notification) {
  try {
    const userSnapshot = await database
      .ref(`/users/${userId}`)
      .once('value');
    const userData = userSnapshot.val();
    const fcmToken = userData?.fcmToken;

    if (!fcmToken) {
      console.log('No FCM token found for user:', userId);
      return;
    }

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: notification.title,
      body: notification.body,
      data: notification.data,
      android: {
        channelId,
        pressAction: { id: 'default', launchActivity: 'default' },
      },
    });
  } catch (error) {
    console.error('Error in displayNotification:', error);
  }
}