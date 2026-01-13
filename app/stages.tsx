import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, ScrollView, Dimensions, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, CherryBombOne_400Regular } from '@expo-google-fonts/cherry-bomb-one';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GameHeader from '../app/header';
import StageCard from '../app/stagesCard';

const { width, height } = Dimensions.get('window');
const CARD_MARGIN = 16;
const SLIDER_WIDTH = width - (CARD_MARGIN * 2);
const SLIDER_HEIGHT = height * 0.25;

function Stages() {
  const [playerName, setPlayerName] = useState('Guest');
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const images = [
    require('../assets/images/slide1.png'),
    require('../assets/images/slide2.png'),
    require('../assets/images/slide1.png'),
    require('../assets/images/slide1.png'),
  ];

  const [fontsLoaded] = useFonts({
    'Cherry-Bomb': CherryBombOne_400Regular,
  });

  // Bounce animation for title
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Automatic slider
  useEffect(() => {
    const timer = setInterval(() => {
      let nextSlide = (activeSlide + 1) % images.length;
      setActiveSlide(nextSlide);
      
      scrollRef.current?.scrollTo({
        x: nextSlide * SLIDER_WIDTH,
        animated: true,
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [activeSlide]);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const name = await AsyncStorage.getItem('playerName');
        if (name) setPlayerName(name);
      } catch (error) {
        console.log('Error fetching name:', error);
      }
    };
    fetchName();
  }, []);

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SLIDER_WIDTH);
    if (slideIndex !== activeSlide) {
      setActiveSlide(slideIndex);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFF5E6', '#FFE4D6', '#FFFFFF']}
        style={styles.gradientBackground}
      >
        <GameHeader playerName={playerName} coins={120} />

        {/* Enhanced Slider */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderWrapper}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              {images.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={img} style={styles.imageStyle} resizeMode="cover" />
                  {/* Gradient overlay for better text visibility */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                    style={styles.imageOverlay}
                  />
                </View>
              ))}
            </ScrollView>

            {/* Enhanced Dots Indicator */}
            <View style={styles.dotsRow}>
              {images.map((_, i) => (
                <Animated.View 
                  key={i} 
                  style={[
                    styles.dot, 
                    activeSlide === i ? styles.activeDot : styles.inactiveDot
                  ]} 
                />
              ))}
            </View>
          </View>
        </View>

        {/* Animated Title */}
        <View style={styles.titleContainer}>
          <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
            <Text style={styles.titleText}>🎮 Choose Your Stage!</Text>
          </Animated.View>
          <View style={styles.titleUnderline} />
        </View>

        {/* Stages List */}
        <ScrollView 
          style={styles.stagesScrollView}
          contentContainerStyle={styles.stagesContent}
          showsVerticalScrollIndicator={false}
        >
          <StageCard
            subtitle="Stage 1"
            title="Identify the Books"
            iconName="search-circle"
            iconColor="#FF8C00"
            buttonColor="#4ECDC4"
            onPress={() => router.push('/')}
          />
          <StageCard
            subtitle="Stage 2"
            title="Spell the Books"
            iconName="text"
            iconColor="#7209B7"
            buttonColor="#F72585"
            onPress={() => router.push('/')}
          />
          <StageCard
            subtitle="Stage 3"
            title="Rearrange in Order"
            iconName="list"
            iconColor="#2D6A4F"
            buttonColor="#FFD166"
            onPress={() => router.push('/')}
          />
          
          {/* Bottom padding for better scrolling */}
          <View style={styles.bottomPadding} />
        </ScrollView>
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
  sliderContainer: {
    marginTop: 12,
    marginHorizontal: CARD_MARGIN,
    marginBottom: 8,
  },
  sliderWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    backgroundColor: '#fff',
  },
  scrollView: {
    height: SLIDER_HEIGHT,
  },
  scrollContent: {
    alignItems: 'center',
  },
  imageWrapper: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE4D6',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  dotsRow: {
    backgroundColor: 'rgba(255, 140, 0, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 25,
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: CARD_MARGIN,
  },
  titleText: {
    fontSize: 28,
    fontFamily: 'Cherry-Bomb',
    color: '#FF6B35',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 107, 53, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  titleUnderline: {
    width: 120,
    height: 4,
    backgroundColor: '#FFD166',
    borderRadius: 2,
    marginTop: 8,
  },
  stagesScrollView: {
    flex: 1,
    paddingHorizontal: CARD_MARGIN,
  },
  stagesContent: {
    paddingTop: 8,
  },
  bottomPadding: {
    height: 24,
  },
});

export default Stages;