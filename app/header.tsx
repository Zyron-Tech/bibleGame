import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Built-in with Expo
import { router } from 'expo-router';
import { useGameStore } from './userStore';


const GameHeader = ({ coins = 0 }: { coins: number }) => {
const playerName = useGameStore((state) => state.playerName);
return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerWrapper}>
        
        {/* LEFT: Back Button */}
        <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* CENTER: Name & Info */}
        <View style={styles.centerInfo}>
          <Text style={styles.smallWelcome}>Playing as {playerName}</Text>
          <Text style={styles.nameText} numberOfLines={1}>{playerName}</Text>
        </View>

        {/* RIGHT: Game Stats (Icons) */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.statValue}>{coins}</Text>
          </View>
          
          <TouchableOpacity style={styles.settingsBtn}>
             <Ionicons name="settings-outline" size={22} color="#666" />
          </TouchableOpacity>
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
    marginRight:10,
    marginLeft:10,
    marginTop:10,
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
    backgroundColor: 'orange', // Playful red
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
    fontFamily: 'Cherry-Bomb', // Using your font
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
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
  },
  statValue: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#444',
  },
  settingsBtn: {
    padding: 5,
  }
});

export default GameHeader;