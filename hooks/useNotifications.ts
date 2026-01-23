import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
// @ts-ignore - Missing type declarations for 'expo-notifications'
import * as Notifications from 'expo-notifications';
import { NotificationService } from '../services/notificationService';

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    // Register for push notifications
    NotificationService.registerForPushNotifications().then(token => {
      setExpoPushToken(token);
    });

    // Listener for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log('Notification received:', notification);
    });

    // Listener for when user taps on notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // Handle notification tap - navigate to specific screen, etc.
      const data = response.notification.request.content.data;
      handleNotificationTap(data);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const handleNotificationTap = (data: any) => {
    // Navigate based on notification data
    if (data.screen) {
      // navigation.navigate(data.screen);
      console.log('Navigate to:', data.screen);
    }
  };

  return {
    expoPushToken,
    notification,
  };
};