import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, CherryBombOne_400Regular } from '@expo-google-fonts/cherry-bomb-one';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameHeader from '../app/header';
import StageCard from '../app/stagesCard';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const SLIDER_WIDTH = width - (CARD_MARGIN * 2);

function Stages() {
  const [playerName, setPlayerName] = useState('Guest');
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);

  const images = [
    require('../assets/images/slide1.png'),
    require('../assets/images/slide2.png'),
    require('../assets/images/slide1.png'),
    require('../assets/images/slide1.png'),
  ];

  const [fontsLoaded] = useFonts({
    'Cherry-Bomb': CherryBombOne_400Regular,
  });

  // --- AUTOMATIC SLIDER LOGIC ---
  useEffect(() => {
    const timer = setInterval(() => {
      let nextSlide = activeSlide + 1;
      setActiveSlide(nextSlide);
      if (nextSlide >= images.length) nextSlide = 0;
      else if (nextSlide == 0) nextSlide = 2;
      
      
      scrollRef.current?.scrollTo({
        x: nextSlide * SLIDER_WIDTH,
        animated: true,
      });
    }, 3000); // Changes every 3 seconds

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

  // Updates the dots when user swipes manually
  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SLIDER_WIDTH);
    if (slideIndex !== activeSlide) {
      setActiveSlide(slideIndex);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <GameHeader playerName={playerName} coins={120} />

      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {images.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={img} style={styles.imageStyle} />
            </View>
          ))}
        </ScrollView>

        {/* --- DOTS INDICATOR --- */}
        <View style={styles.dotsRow}>
          {images.map((_, i) => (
            <View 
              key={i} 
              style={[styles.dot, activeSlide === i ? styles.activeDot : styles.inactiveDot]} 
            />
          ))}
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Choose Your Stage</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingTop: 10 }}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    backgroundColor: 'orange',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 10,
    marginHorizontal: CARD_MARGIN,
    height: 200,
    overflow: 'hidden',
    elevation: 5,
  },
  imageWrapper: {
    width: SLIDER_WIDTH,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    // resizeMode: 'cover',
    // marginTop: -50,
  },
  dotsRow: {
    backgroundColor:'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    position: 'absolute',
    bottom: 5,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    height: 5,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 13, // Long dot for active
    backgroundColor: 'white',
  },
  inactiveDot: {
    width: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  titleText: {
    fontSize: 24,
    fontFamily: 'Cherry-Bomb',
    color: 'black',
  },
});

export default Stages;