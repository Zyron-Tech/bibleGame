import React, { useEffect, useState, useRef } from 'react';
import { playSound, SoundEffect} from './audioSystem';
import { 
  Text, 
  TouchableOpacity, 
  View, 
  KeyboardAvoidingView, 
  StyleSheet, 
  Animated,
  Dimensions,
  Platform,
  ScrollView
} from 'react-native';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from './userStore';

const { width, height } = Dimensions.get('window');

function Index() {
  const [name, setName] = useState('');
  const setGlobalName = useGameStore((state) => state.setPlayerName);
  const loadFromStorage = useGameStore((state) => state.loadFromStorage);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadName();
    loadFromStorage();
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // Slide up animation
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 40,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 40,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Continuous bounce animation for decorative elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Continuous rotation for decorative elements
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation for button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const saveName = async () => {
    try {
      await AsyncStorage.setItem('playerName', name);
    } catch (error) {
      console.log('Error saving name:', error);
    }
  };

  const startGame = async () => {
    if (name.trim() === '') {
      alert('Please enter your name to start!');
      return;
    }
    await saveName();
    setGlobalName(name);
    router.push('/stages');
  };

  const loadName = async () => {
    try {
      const storedName = await AsyncStorage.getItem('playerName');
      if (storedName !== null) {
        setName(storedName);
      }
    } catch (error) {
      console.log('Error loading name:', error);
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.container}
      >
        {/* Animated Background Elements */}
        <Animated.View 
          style={[
            styles.decorCircle1,
            { transform: [{ translateY: bounceAnim }, { rotate: spin }] }
          ]} 
        />
        <Animated.View 
          style={[
            styles.decorCircle2,
            { transform: [{ rotate: spin }] }
          ]} 
        />
        <Animated.View 
          style={[
            styles.decorCircle3,
            { transform: [{ translateY: bounceAnim }] }
          ]} 
        />
        
        {/* Floating particles */}
        <View style={styles.particlesContainer}>
          {[...Array(6)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  left: `${(i * 20) % 100}%`,
                  top: `${(i * 15) % 80}%`,
                  transform: [{ translateY: bounceAnim }],
                  opacity: 0.3,
                }
              ]}
            />
          ))}
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Animated.View 
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              {/* Company Branding - Premium Style */}
              <Animated.View 
                style={[
                  styles.companyBrand,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <LinearGradient
                  colors={['#FF6B35', '#FF8C00']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.brandGradient}
                >
                  <View style={styles.heartIcon}>
                    <Ionicons name="heart" size={15} color="#fff" />
                  </View>
                  <Text style={styles.companyText}>The Lover's Mind! Games</Text>
                </LinearGradient>
              </Animated.View>

              {/* Large Game Logo/Image */}
              <Animated.View 
                style={[
                  styles.imageContainer,
                  { transform: [{ scale: scaleAnim }] }
                ]}
              >
                <View style={styles.imageGlow}>
                  <Image 
                    source={require('../assets/images/splash.png')} 
                    style={styles.gameImage}
                    resizeMode="contain"
                  />
                </View>
                
                {/* Floating Sparkles */}
                <Animated.View 
                  style={[
                    styles.sparkle1,
                    { transform: [{ translateY: bounceAnim }, { rotate: spin }] }
                  ]}
                >
                  <Ionicons name="sparkles" size={28} color="#FFD700" />
                </Animated.View>
                <Animated.View 
                  style={[
                    styles.sparkle2,
                    { transform: [{ translateY: bounceAnim }, { rotate: spin }] }
                  ]}
                >
                  <Ionicons name="star" size={24} color="#FF6B35" />
                </Animated.View>
                <Animated.View 
                  style={[
                    styles.sparkle3,
                    { transform: [{ translateY: bounceAnim }] }
                  ]}
                >
                  <Ionicons name="sparkles" size={20} color="#4ECDC4" />
                </Animated.View>
              </Animated.View>

              {/* Modern Tagline */}
              <View style={styles.taglineContainer}>
                <View style={styles.taglineDot} />
                <Text style={styles.tagline}>Master the Word Through Play</Text>
                <View style={styles.taglineDot} />
              </View>

              {/* Glassmorphic Input Card */}
              <View style={styles.inputWrapper}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.inputCard}
                >
                  <View style={styles.inputIconContainer}>
                    <Ionicons name="person-outline" size={22} color="#fff" />
                  </View>
                  <TextInput 
                    placeholder="Enter your name" 
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={name}
                    onChangeText={(text) => setName(text)}
                    style={styles.input}
                    autoCapitalize="words"
                    returnKeyType="done"
                    onSubmitEditing={startGame}
                  />
                </LinearGradient>
              </View>

              {/* Modern Start Button */}
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity 
                  style={styles.startButton}
                  onPress={()=> {
                    playSound(SoundEffect.BUTTON_PRESS);
                    startGame();
                  }}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={['#FF6B35', '#FF8C00', '#FFA500']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>START ADVENTURE</Text>
                    <View style={styles.arrowContainer}>
                      <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Modern Features Grid */}
              <View style={styles.featuresContainer}>
                <View style={styles.featureCard}>
                  <View style={styles.featureIconBg}>
                    <Ionicons name="star" size={20} color="#FFD700" />
                  </View>
                  <Text style={styles.featureText}>Earn Coins</Text>
                </View>
                <View style={styles.featureCard}>
                  <View style={styles.featureIconBg}>
                    <Ionicons name="trophy" size={20} color="#FF6B35" />
                  </View>
                  <Text style={styles.featureText}>Track Progress</Text>
                </View>
                <View style={styles.featureCard}>
                  <View style={styles.featureIconBg}>
                    <Ionicons name="book" size={20} color="#4ECDC4" />
                  </View>
                  <Text style={styles.featureText}>66 Books</Text>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  
  // Company Branding
  companyBrand: {
    marginBottom: 20,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  brandGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 20,
    gap: 10,
  },
  heartIcon: {
    width: 25,
    height: 25,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Image Container
  imageContainer: {
    position: 'relative',
    marginVertical: 15,
  },
  imageGlow: {
    borderRadius: 30,
    padding: 10,
  },
  gameImage: {
    width: width * 0.8,
    height: width * 0.8,
    maxWidth: 350,
    maxHeight: 350,
  },
  sparkle1: {
    position: 'absolute',
    top: -10,
    right: 20,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 30,
    left: 15,
  },
  sparkle3: {
    position: 'absolute',
    top: 50,
    left: -5,
  },

  // Tagline
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 25,
  },
  taglineDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FF6B35',
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Input
  inputWrapper: {
    width: '100%',
    maxWidth: 360,
    marginBottom: 20,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputIconContainer: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },

  // Button
  startButton: {
    width: width * 0.85,
    maxWidth: 360,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    marginBottom: 25,
  },
  buttonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 35,
    gap: 10,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1.5,
  },
  arrowContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Features
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 360,
    gap: 10,
  },
  featureCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  featureIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Decorative Elements
  decorCircle1: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
  },
  decorCircle3: {
    position: 'absolute',
    top: '40%',
    right: -40,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
});

export default Index;