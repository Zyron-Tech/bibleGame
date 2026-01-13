import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StageCard = ({ 
  title, 
  subtitle, 
  iconName, 
  iconColor = "#FF8C00", 
  buttonColor = "#4ECDC4", 
  onPress 
}) => {

  const bounceValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, { toValue: 1.08, duration: 1000, useNativeDriver: true }),
        Animated.timing(bounceValue, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.cardContainer}>
      {/* Left Icon Section */}
      <View style={[styles.iconCircle, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={iconName} size={32} color={iconColor} />
      </View>

      {/* Center Text Section */}
      <View style={styles.textContainer}>
        <Text style={[styles.subTitle, { color: iconColor }]}>{subtitle.toUpperCase()}</Text>
        <Text style={styles.mainTitle} numberOfLines={2}>{title}</Text>
      </View>

      {/* Animated Play Button */}
      <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
        <View style={[styles.playButton, { backgroundColor: buttonColor, borderBottomColor: buttonColor + 'aa' }]}>
          <Ionicons name="play" size={20} color="white" />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  iconCircle: {
    width: 65,
    height: 65,
    borderRadius: 20, // Squircle shape for kids
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  subTitle: {
    fontFamily: 'Cherry-Bomb',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 2,
  },
  mainTitle: {
    fontFamily: 'Cherry-Bomb',
    fontSize: 18,
    color: '#333',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
  },
});

export default StageCard;