import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BackButton } from '../components/BackButton';
import { NotificationService, NotificationPreferences } from '../services/notificationService';

interface NotificationSettingsProps {
  onBack: () => void;
}

export const NotificationSettingsScreen: React.FC<NotificationSettingsProps> = ({ onBack }) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: true,
    dailyReminder: true,
    weeklyChallenge: true,
    achievements: true,
    updates: true,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const prefs = await NotificationService.getNotificationPreferences();
    setPreferences(prefs);
  };

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    await NotificationService.saveNotificationPreferences(newPrefs);

    // If daily reminder is enabled, schedule it
    if (key === 'dailyReminder' && value) {
      await NotificationService.scheduleDailyReminder(9, 0); // 9:00 AM
    } else if (key === 'dailyReminder' && !value) {
      await NotificationService.cancelAllNotifications();
    }
  };

  return (
    <LinearGradient colors={['#E0F4FF', '#FFFFFF']} className="flex-1">
      <BackButton onPress={onBack} />
      
      <ScrollView className="flex-1 p-6 pt-24">
        <Text className="text-4xl font-bold text-blue-600 mb-2 text-center">🔔</Text>
        <Text className="text-3xl font-bold text-gray-800 mb-8 text-center">Notifications</Text>

        <View className="bg-white rounded-3xl p-6 shadow-lg">
          <NotificationToggle
            label="Enable Notifications"
            description="Receive all notifications"
            icon="🔔"
            value={preferences.enabled}
            onValueChange={(val) => updatePreference('enabled', val)}
          />

          <View className="my-4 border-t border-gray-200" />

          <NotificationToggle
            label="Daily Reminder"
            description="Get reminded to play every day at 9 AM"
            icon="📅"
            value={preferences.dailyReminder}
            onValueChange={(val) => updatePreference('dailyReminder', val)}
            disabled={!preferences.enabled}
          />

          <NotificationToggle
            label="Weekly Challenge"
            description="New challenges every week"
            icon="🏆"
            value={preferences.weeklyChallenge}
            onValueChange={(val) => updatePreference('weeklyChallenge', val)}
            disabled={!preferences.enabled}
          />

          <NotificationToggle
            label="Achievements"
            description="Get notified when you earn badges"
            icon="⭐"
            value={preferences.achievements}
            onValueChange={(val) => updatePreference('achievements', val)}
            disabled={!preferences.enabled}
          />

          <NotificationToggle
            label="App Updates"
            description="News about new features"
            icon="🎉"
            value={preferences.updates}
            onValueChange={(val) => updatePreference('updates', val)}
            disabled={!preferences.enabled}
          />
        </View>

        <TouchableOpacity
          onPress={async () => {
            await NotificationService.scheduleLocalNotification(
              'Test Notification',
              'This is how notifications will look!',
              { seconds: 2 }
            );
          }}
          className="mt-6 bg-blue-500 py-4 rounded-full shadow-lg"
        >
          <Text className="text-white text-center font-bold text-lg">
            Send Test Notification
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

interface NotificationToggleProps {
  label: string;
  description: string;
  icon: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  label,
  description,
  icon,
  value,
  onValueChange,
  disabled = false,
}) => {
  return (
    <View className="py-4">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-3 flex-1">
          <Text className="text-3xl">{icon}</Text>
          <View className="flex-1">
            <Text className="text-gray-800 text-lg font-semibold">{label}</Text>
            <Text className="text-gray-500 text-sm mt-1">{description}</Text>
          </View>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{ false: '#D1D5DB', true: '#60A5FA' }}
          thumbColor={value ? '#3B82F6' : '#F3F4F6'}
        />
      </View>
    </View>
  );
};