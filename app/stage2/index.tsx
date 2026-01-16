import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GameHeader from '../header';

const { width } = Dimensions.get('window');

function Index() {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Bounce animation for rocket
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -20,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFF5E6', '#FFE4D6', '#FFFFFF']}
        style={styles.gradientBackground}
      >
        {/* <GameHeader /> */}

        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Animated Rocket Icon */}
          <Animated.View 
            style={[
              styles.iconContainer,
              { transform: [{ translateY: bounceAnim }] }
            ]}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="rocket" size={80} color="#FF6B35" />
            </View>
            
            {/* Sparkles around rocket */}
            <View style={styles.sparkle1}>
              <Ionicons name="sparkles" size={24} color="#FFD700" />
            </View>
            <View style={styles.sparkle2}>
              <Ionicons name="sparkles" size={20} color="#FF6B35" />
            </View>
            <View style={styles.sparkle3}>
              <Ionicons name="sparkles" size={18} color="#4ECDC4" />
            </View>
          </Animated.View>

          {/* Coming Soon Text */}
          <View style={styles.textContainer}>
            <Text style={styles.comingSoonText}>Coming Soon!</Text>
            <View style={styles.underline} />
            
            <Text style={styles.stageTitle}>Stage 2: Spell the Books</Text>
            
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>
                🎯 Get ready to test your spelling skills!
              </Text>
              <Text style={styles.descriptionText}>
                ✍️ Learn to spell all 66 Bible books
              </Text>
              <Text style={styles.descriptionText}>
                🏆 Earn rewards and master your knowledge
              </Text>
            </View>

            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Ionicons name="construct" size={20} color="#FF6B35" />
                <Text style={styles.badgeText}>In Development</Text>
              </View>
            </View>

            <Text style={styles.footerText}>
              Stay tuned for updates! 🌟
            </Text>
          </View>
        </Animated.View>

        {/* Decorative Elements */}
        <View style={styles.decoration1} />
        <View style={styles.decoration2} />
        <View style={styles.decoration3} />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6',
  },
  gradientBackground: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 4,
    borderColor: '#FFE4D6',
  },
  sparkle1: {
    position: 'absolute',
    top: -10,
    right: 10,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 10,
    left: -10,
  },
  sparkle3: {
    position: 'absolute',
    top: 30,
    left: -20,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  comingSoonText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 107, 53, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  underline: {
    width: 80,
    height: 4,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    marginBottom: 20,
  },
  stageTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  descriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
    lineHeight: 24,
  },
  badgeContainer: {
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE4D6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FF6B35',
    gap: 8,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  footerText: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  // Decorative circles
  decoration1: {
    position: 'absolute',
    top: 100,
    left: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  decoration2: {
    position: 'absolute',
    bottom: 150,
    right: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },
  decoration3: {
    position: 'absolute',
    top: 200,
    right: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
});

export default Index;