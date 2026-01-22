import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, any>;
  timestamp: string;
}

export interface UserMetrics {
  userId: string;
  installDate: string;
  lastActiveDate: string;
  sessionsCount: number;
  totalPlayTime: number;
  gamesCompleted: number;
  currentLevel: number;
  deviceInfo: {
    platform: string;
    model: string;
    osVersion: string;
    appVersion: string;
  };
}

const ANALYTICS_ENDPOINT = 'https://your-backend.com/api/analytics';

export const AnalyticsService = {
  // Track app install/first open
  async trackInstall(): Promise<void> {
    const installDate = await AsyncStorage.getItem('installDate');
    
    if (!installDate) {
      const now = new Date().toISOString();
      await AsyncStorage.setItem('installDate', now);
      
      await this.trackEvent('app_installed', {
        platform: Platform.OS,
        deviceModel: Device.modelName,
        osVersion: Device.osVersion,
        appVersion: Constants.expoConfig?.version || '1.0.0',
      });
    }
  },

  // Track app open
  async trackAppOpen(): Promise<void> {
    const sessionsCount = await this.getSessionCount();
    await this.incrementSessionCount();
    
    await this.trackEvent('app_opened', {
      sessionNumber: sessionsCount + 1,
      platform: Platform.OS,
    });

    await AsyncStorage.setItem('lastActiveDate', new Date().toISOString());
  },

  // Track custom event
  async trackEvent(eventName: string, properties?: Record<string, any>): Promise<void> {
    const event: AnalyticsEvent = {
      eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        platform: Platform.OS,
      },
      timestamp: new Date().toISOString(),
    };

    try {
      // Save locally first
      await this.saveEventLocally(event);

      // Send to backend
      const userId = await AsyncStorage.getItem('username');
      const pushToken = await AsyncStorage.getItem('pushToken');

      await fetch(`${ANALYTICS_ENDPOINT}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          pushToken,
          event,
        }),
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  },

  // Track screen view
  async trackScreenView(screenName: string): Promise<void> {
    await this.trackEvent('screen_view', {
      screenName,
    });
  },

  // Track game completion
  async trackGameCompletion(mode: string, stage: number, score: number): Promise<void> {
    await this.trackEvent('game_completed', {
      gameMode: mode,
      stageNumber: stage,
      score,
    });
  },

  // Track user action
  async trackUserAction(action: string, details?: Record<string, any>): Promise<void> {
    await this.trackEvent('user_action', {
      action,
      ...details,
    });
  },

  // Get user metrics for backend
  async getUserMetrics(): Promise<UserMetrics> {
    const userId = (await AsyncStorage.getItem('username')) || 'anonymous';
    const installDate = (await AsyncStorage.getItem('installDate')) || new Date().toISOString();
    const lastActiveDate = (await AsyncStorage.getItem('lastActiveDate')) || new Date().toISOString();
    const sessionsCount = await this.getSessionCount();
    const progress = await AsyncStorage.getItem('playerProgress');
    const progressData = progress ? JSON.parse(progress) : {};

    return {
      userId,
      installDate,
      lastActiveDate,
      sessionsCount,
      totalPlayTime: 0, // Track this separately
      gamesCompleted: progressData.gamesPlayed || 0,
      currentLevel: Object.keys(progressData.completedStages || {}).length,
      deviceInfo: {
        platform: Platform.OS,
        model: Device.modelName || 'unknown',
        osVersion: Device.osVersion || 'unknown',
        appVersion: Constants.expoConfig?.version || '1.0.0',
      },
    };
  },

  // Send user metrics to backend
  async syncUserMetrics(): Promise<void> {
    try {
      const metrics = await this.getUserMetrics();
      const pushToken = await AsyncStorage.getItem('pushToken');

      await fetch(`${ANALYTICS_ENDPOINT}/user-metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...metrics,
          pushToken,
        }),
      });
    } catch (error) {
      console.error('Error syncing user metrics:', error);
    }
  },

  // Helper functions
  async getSessionCount(): Promise<number> {
    const count = await AsyncStorage.getItem('sessionsCount');
    return count ? parseInt(count, 10) : 0;
  },

  async incrementSessionCount(): Promise<void> {
    const count = await this.getSessionCount();
    await AsyncStorage.setItem('sessionsCount', (count + 1).toString());
  },

  async saveEventLocally(event: AnalyticsEvent): Promise<void> {
    const events = await this.getLocalEvents();
    events.push(event);
    await AsyncStorage.setItem('localEvents', JSON.stringify(events.slice(-100))); // Keep last 100
  },

  async getLocalEvents(): Promise<AnalyticsEvent[]> {
    const events = await AsyncStorage.getItem('localEvents');
    return events ? JSON.parse(events) : [];
  },
};

// ============================================
// FILE: hooks/useNotifications.ts
// ============================================
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
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