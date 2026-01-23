import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);

  useEffect(() => {
    loadSettings();
    trackScreenView();
  }, []);

  const trackScreenView = async () => {
    try {
      const { AnalyticsService } = await import('../services/analyticsService');
      await AnalyticsService.trackScreenView('settings');
    } catch (error) {
      console.error('Error tracking screen:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('gameSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setNotificationsEnabled(parsed.notifications ?? true);
        setSoundEnabled(parsed.sound ?? true);
        setMusicEnabled(parsed.music ?? true);
        setDailyReminder(parsed.dailyReminder ?? true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (key: string, value: boolean) => {
    try {
      const current = await AsyncStorage.getItem('gameSettings');
      const settings = current ? JSON.parse(current) : {};
      settings[key] = value;
      await AsyncStorage.setItem('gameSettings', JSON.stringify(settings));

      // Track settings change
      const { AnalyticsService } = await import('../services/analyticsService');
      await AnalyticsService.trackEvent('settings_changed', {
        setting: key,
        value
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await saveSettings('notifications', value);

    if (value) {
      // Setup daily reminder
      try {
        const { NotificationService } = await import('../services/notificationService');
        await NotificationService.scheduleDailyReminder(9, 0);
      } catch (error) {
        console.error('Error scheduling reminder:', error);
      }
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all game progress? This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            // Reset game store
            const { useGameStore } = await import('./userStore');
            useGameStore.getState().resetStage1Progress();
            
            // Track reset
            const { AnalyticsService } = await import('../services/analyticsService');
            await AnalyticsService.trackEvent('progress_reset');
            
            Alert.alert('Success', 'Your progress has been reset!');
            router.back();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFF5E6', '#FFE4D6', '#FFFFFF']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#FF6B35" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings ⚙️</Text>
          <View style={{ width: 48 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔔 Notifications</Text>
            
            <SettingRow
              icon="notifications"
              label="Push Notifications"
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
            />
            
            <SettingRow
              icon="alarm"
              label="Daily Reminder"
              description="Get reminded at 9:00 AM every day"
              value={dailyReminder}
              onValueChange={(val) => {
                setDailyReminder(val);
                saveSettings('dailyReminder', val);
              }}
              disabled={!notificationsEnabled}
            />
          </View>

          {/* Audio Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔊 Audio</Text>
            
            <SettingRow
              icon="volume-high"
              label="Sound Effects"
              value={soundEnabled}
              onValueChange={(val) => {
                setSoundEnabled(val);
                saveSettings('sound', val);
              }}
            />
            
            <SettingRow
              icon="musical-notes"
              label="Background Music"
              value={musicEnabled}
              onValueChange={(val) => {
                setMusicEnabled(val);
                saveSettings('music', val);
              }}
            />
          </View>

          {/* Game Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎮 Game</Text>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleResetProgress}>
              <Ionicons name="refresh" size={24} color="#FF6B35" />
              <Text style={styles.actionButtonText}>Reset Progress</Text>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ℹ️ About</Text>
            
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>App Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Developer</Text>
              <Text style={styles.infoValue}>The Lover's Mind! Games</Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const SettingRow = ({ icon, label, description, value, onValueChange, disabled = false }) => (
  <View style={[styles.settingRow, disabled && styles.settingRowDisabled]}>
    <View style={styles.settingLeft}>
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={22} color={disabled ? '#999' : '#FF6B35'} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingLabel, disabled && styles.textDisabled]}>{label}</Text>
        {description && (
          <Text style={[styles.settingDescription, disabled && styles.textDisabled]}>
            {description}
          </Text>
        )}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: '#D1D5DB', true: '#FF8C00' }}
      thumbColor={value ? '#FF6B35' : '#F3F4F6'}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    backgroundColor: '#FFE4D6',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingRowDisabled: {
    opacity: 0.5,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE4D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  textDisabled: {
    color: '#999',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});