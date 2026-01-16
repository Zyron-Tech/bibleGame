import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGameStore } from './userStore';

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
            onPress={() => router.back()}
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
  }
});

export default GameHeader;