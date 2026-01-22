import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationPreferences {
  enabled: boolean;
  dailyReminder: boolean;
  weeklyChallenge: boolean;
  achievements: boolean;
  updates: boolean;
}

const STORAGE_KEYS = {
  PUSH_TOKEN: 'pushToken',
  NOTIFICATION_PREFS: 'notificationPreferences',
};

export const NotificationService = {
  // Register for push notifications and get token
  async registerForPushNotifications(): Promise<string | null> {
    let token = null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      try {
        token = (await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        })).data;

        // Save token locally
        await AsyncStorage.setItem(STORAGE_KEYS.PUSH_TOKEN, token);
        
        // Send token to your backend
        await this.sendTokenToBackend(token);
        
        console.log('Push token:', token);
      } catch (error) {
        console.error('Error getting push token:', error);
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    return token;
  },

  // Send token to your backend server
  async sendTokenToBackend(token: string): Promise<void> {
    try {
      const userId = await AsyncStorage.getItem('username');
      const deviceInfo = {
        token,
        userId,
        platform: Platform.OS,
        deviceName: Device.modelName,
        osVersion: Device.osVersion,
        timestamp: new Date().toISOString(),
      };

      // Replace with your actual backend URL
      const response = await fetch('https://your-backend.com/api/register-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceInfo),
      });

      if (!response.ok) {
        throw new Error('Failed to register device');
      }

      console.log('Device registered successfully');
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  },

  // Get saved push token
  async getSavedPushToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.PUSH_TOKEN);
  },

  // Schedule local notification
  async scheduleLocalNotification(
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: { type: 'local' },
      },
      trigger,
    });
  },

  // Schedule daily reminder
  async scheduleDailyReminder(hour: number = 9, minute: number = 0): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📖 Bible Quest Time!',
        body: "Ready to learn more about God's Word today?",
        sound: true,
        data: { type: 'daily_reminder' },
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
  },

  // Save notification preferences
  async saveNotificationPreferences(prefs: NotificationPreferences): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFS, JSON.stringify(prefs));
    
    // Update backend
    try {
      const token = await this.getSavedPushToken();
      await fetch('https://your-backend.com/api/notification-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, preferences: prefs }),
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  },

  // Get notification preferences
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFS);
    return saved ? JSON.parse(saved) : {
      enabled: true,
      dailyReminder: true,
      weeklyChallenge: true,
      achievements: true,
      updates: true,
    };
  },

  // Cancel all notifications
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};