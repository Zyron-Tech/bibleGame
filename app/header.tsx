import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGameStore } from './userStore'; // Import the new global store
import { playSound, SoundEffect} from './audioSystem';



interface GameHeaderProps {
  showBackButton?: boolean;
  onSettingsPress?: () => void;
}

const GameHeader = ({ 
  showBackButton = true,
  onSettingsPress 
}: GameHeaderProps) => {
  // Get data directly from global store
  const playerName = useGameStore((state) => state.playerName);
  const totalCoins = useGameStore((state) => state.totalCoins);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerWrapper}>
        
        {/* LEFT: Back Button */}
        {showBackButton && (
          <TouchableOpacity 
            style={styles.iconCircle} 
            onPress={() => {
              playSound(SoundEffect.BUTTON_PRESS);
              router.back();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}

        {/* CENTER: Name & Info */}
        <View style={styles.centerInfo}>
          <Text style={styles.smallWelcome}>Playing as</Text>
          <Text style={styles.nameText} numberOfLines={1}>
            {playerName || 'Guest'}
          </Text>
        </View>

        {/* RIGHT: Game Stats (Coins) */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.statValue}>{totalCoins}</Text>
          </View>

          
          {onSettingsPress && (
            <TouchableOpacity 
              style={styles.settingsBtn}
              onPress={onSettingsPress}
            >
              <Ionicons name="settings-outline" size={22} color="#666" />
            </TouchableOpacity>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFF', 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 10,
    marginTop: 10,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20.5,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerInfo: {
    flex: 1,
    paddingHorizontal: 15,
  },
  smallWelcome: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Cherry-Bomb',
    marginBottom: -5,
  },
  nameText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Cherry-Bomb',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  statValue: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#FF6B35',
    fontSize: 16,
  },
  settingsBtn: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 25,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ddd',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#4ECDC4',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  closeButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 25,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameHeader;