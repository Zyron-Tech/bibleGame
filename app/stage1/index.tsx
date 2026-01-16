import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../userStore';
import GameHeader from '../header';

const { width } = Dimensions.get('window');

// All 66 books of the Bible divided into 6 levels (11 books each)
const BIBLE_BOOKS = [
  // Level 1 (Old Testament - Torah/Pentateuch + Historical)
  [
    { initial: 'G', name: 'Genesis', number: 1 },
    { initial: 'E', name: 'Exodus', number: 2 },
    { initial: 'L', name: 'Leviticus', number: 3 },
    { initial: 'N', name: 'Numbers', number: 4 },
    { initial: 'D', name: 'Deuteronomy', number: 5 },
    { initial: 'J', name: 'Joshua', number: 6 },
    { initial: 'J', name: 'Judges', number: 7 },
    { initial: 'R', name: 'Ruth', number: 8 },
    { initial: '1S', name: '1 Samuel', number: 9 },
    { initial: '2S', name: '2 Samuel', number: 10 },
    { initial: '1K', name: '1 Kings', number: 11 },
  ],
  // Level 2 (Historical Books continued)
  [
    { initial: '2K', name: '2 Kings', number: 12 },
    { initial: '1C', name: '1 Chronicles', number: 13 },
    { initial: '2C', name: '2 Chronicles', number: 14 },
    { initial: 'E', name: 'Ezra', number: 15 },
    { initial: 'N', name: 'Nehemiah', number: 16 },
    { initial: 'E', name: 'Esther', number: 17 },
    { initial: 'J', name: 'Job', number: 18 },
    { initial: 'P', name: 'Psalms', number: 19 },
    { initial: 'P', name: 'Proverbs', number: 20 },
    { initial: 'E', name: 'Ecclesiastes', number: 21 },
    { initial: 'S', name: 'Song of Solomon', number: 22 },
  ],
  // Level 3 (Major & Minor Prophets)
  [
    { initial: 'I', name: 'Isaiah', number: 23 },
    { initial: 'J', name: 'Jeremiah', number: 24 },
    { initial: 'L', name: 'Lamentations', number: 25 },
    { initial: 'E', name: 'Ezekiel', number: 26 },
    { initial: 'D', name: 'Daniel', number: 27 },
    { initial: 'H', name: 'Hosea', number: 28 },
    { initial: 'J', name: 'Joel', number: 29 },
    { initial: 'A', name: 'Amos', number: 30 },
    { initial: 'O', name: 'Obadiah', number: 31 },
    { initial: 'J', name: 'Jonah', number: 32 },
    { initial: 'M', name: 'Micah', number: 33 },
  ],
  // Level 4 (Minor Prophets + Gospels start)
  [
    { initial: 'N', name: 'Nahum', number: 34 },
    { initial: 'H', name: 'Habakkuk', number: 35 },
    { initial: 'Z', name: 'Zephaniah', number: 36 },
    { initial: 'H', name: 'Haggai', number: 37 },
    { initial: 'Z', name: 'Zechariah', number: 38 },
    { initial: 'M', name: 'Malachi', number: 39 },
    { initial: 'M', name: 'Matthew', number: 40 },
    { initial: 'M', name: 'Mark', number: 41 },
    { initial: 'L', name: 'Luke', number: 42 },
    { initial: 'J', name: 'John', number: 43 },
    { initial: 'A', name: 'Acts', number: 44 },
  ],
  // Level 5 (Paul's Epistles)
  [
    { initial: 'R', name: 'Romans', number: 45 },
    { initial: '1C', name: '1 Corinthians', number: 46 },
    { initial: '2C', name: '2 Corinthians', number: 47 },
    { initial: 'G', name: 'Galatians', number: 48 },
    { initial: 'E', name: 'Ephesians', number: 49 },
    { initial: 'P', name: 'Philippians', number: 50 },
    { initial: 'C', name: 'Colossians', number: 51 },
    { initial: '1T', name: '1 Thessalonians', number: 52 },
    { initial: '2T', name: '2 Thessalonians', number: 53 },
    { initial: '1T', name: '1 Timothy', number: 54 },
    { initial: '2T', name: '2 Timothy', number: 55 },
  ],
  // Level 6 (General Epistles)
  [
    { initial: 'T', name: 'Titus', number: 56 },
    { initial: 'P', name: 'Philemon', number: 57 },
    { initial: 'H', name: 'Hebrews', number: 58 },
    { initial: 'J', name: 'James', number: 59 },
    { initial: '1P', name: '1 Peter', number: 60 },
    { initial: '2P', name: '2 Peter', number: 61 },
    { initial: '1J', name: '1 John', number: 62 },
    { initial: '2J', name: '2 John', number: 63 },
    { initial: '3J', name: '3 John', number: 64 },
    { initial: 'J', name: 'Jude', number: 65 },
    { initial: 'R', name: 'Revelation', number: 66 },
  ],
];

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
const POINTS_PER_LEVEL = 10;

function Index() {
  const [showLevelCompleteModal, setShowLevelCompleteModal] = useState(false);
  const bounceAnims = useRef({}).current;

  // Get state and actions from global store
  const stage1Progress = useGameStore((state) => state.stage1Progress);
  const setStage1Progress = useGameStore((state) => state.setStage1Progress);
  const resetStage1Progress = useGameStore((state) => state.resetStage1Progress);
  const addCoins = useGameStore((state) => state.addCoins);
  const loadFromStorage = useGameStore((state) => state.loadFromStorage);
  const resetAllProgress = useGameStore((state) => state.resetAllProgress);

  const { currentLevel, revealedBooks, bounceCount, levelCompletionStatus } = stage1Progress;
  const currentBooks = BIBLE_BOOKS[currentLevel];

  // Load progress on mount
  useEffect(() => {
    loadFromStorage();
  }, []);

  const handleBookPress = (bookIndex: number) => {
    const bookKey = `${currentLevel}-${bookIndex}`;
    
    if (!revealedBooks[bookKey]) {
      // First press: reveal the book name
      setStage1Progress({
        revealedBooks: { ...revealedBooks, [bookKey]: true }
      });
    } else {
      // Subsequent presses: bounce the number
      const currentCount = bounceCount[bookKey] || 0;
      
      if (currentCount < 3) {
        // Initialize animation if not exists
        if (!bounceAnims[bookKey]) {
          bounceAnims[bookKey] = new Animated.Value(0);
        }

        // Bounce animation
        Animated.sequence([
          Animated.timing(bounceAnims[bookKey], {
            toValue: -15,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnims[bookKey], {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();

        setStage1Progress({
          bounceCount: { ...bounceCount, [bookKey]: currentCount + 1 }
        });
      }
    }
  };

  const getNumberColor = (bookKey: string) => {
    const count = bounceCount[bookKey] || 0;
    const colors = ['#FF6B6B', '#4ECDC4', '#FFA07A', '#98D8C8'];
    return colors[count % colors.length];
  };

  const progress = Object.keys(revealedBooks).filter(key => 
    key.startsWith(`${currentLevel}-`)
  ).length;

  const isLevelComplete = progress === currentBooks.length;
  const currentLevelStatus = levelCompletionStatus[currentLevel] || false;

  // Award points every time a level is completed
  useEffect(() => {
    if (isLevelComplete && !currentLevelStatus) {
      // Award points
      addCoins(POINTS_PER_LEVEL);
      
      // Mark this level as completed (this session)
      setStage1Progress({
        levelCompletionStatus: { ...levelCompletionStatus, [currentLevel]: true }
      });
      
      setShowLevelCompleteModal(true);
      
      // Auto-hide modal after 3 seconds
      setTimeout(() => {
        setShowLevelCompleteModal(false);
      }, 3000);
    }
  }, [isLevelComplete, currentLevelStatus]);

  const handleNextLevel = () => {
    if (currentLevel < BIBLE_BOOKS.length - 1) {
      const newLevel = currentLevel + 1;
      setStage1Progress({
        currentLevel: newLevel,
        levelCompletionStatus: { ...levelCompletionStatus, [newLevel]: false }
      });
    } else {
      // All levels complete!
      Alert.alert(
        '🎉 Congratulations!',
        'You have completed all 66 books of the Bible!',
        [
          { 
            text: 'Play Again', 
            onPress: () => {
              resetStage1Progress();
            }
          },
          { text: 'Exit', onPress: () => router.back() },
        ]
      );
    }
  };

  const handlePreviousLevel = () => {
    if (currentLevel > 0) {
      const newLevel = currentLevel - 1;
      setStage1Progress({
        currentLevel: newLevel,
        levelCompletionStatus: { ...levelCompletionStatus, [newLevel]: false }
      });
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to start over? All your progress will be lost (coins will be kept).',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetStage1Progress()
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFF5E6', '#FFE4D6', '#FFFFFF']}
        style={styles.gradientBackground}
      >
        <GameHeader />

        {/* Level Header */}
        <View style={styles.levelHeader}>
          <View style={styles.headerRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Level {currentLevel + 1}/6</Text>
            </View>
            <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
              <Ionicons name="refresh" size={20} color="#FF6B35" />
            </TouchableOpacity>
          </View>
          <Text style={styles.levelTitle}>Identify the Books! 📖</Text>
          <Text style={styles.levelSubtitle}>
            Tap to reveal • Tap again to bounce
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${(progress / currentBooks.length) * 100}%`,
                  backgroundColor: COLORS[currentLevel]
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {progress}/{currentBooks.length} Books Revealed
          </Text>
        </View>

        {/* Books Grid */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.booksContainer}
          showsVerticalScrollIndicator={false}
        >
          {currentBooks.map((book, index) => {
            const bookKey = `${currentLevel}-${index}`;
            const isRevealed = revealedBooks[bookKey];
            const bounces = bounceCount[bookKey] || 0;

            return (
              <TouchableOpacity
                key={index}
                style={styles.bookCard}
                onPress={() => handleBookPress(index)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    isRevealed 
                      ? [COLORS[currentLevel], COLORS[(currentLevel + 1) % COLORS.length]] 
                      : ['#E0E0E0', '#F5F5F5']
                  }
                  style={styles.bookCardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* Initial or Full Name */}
                  <View style={styles.bookNameContainer}>
                    <Text style={[
                      styles.bookInitial,
                      isRevealed && styles.bookInitialSmall
                    ]}>
                      {!isRevealed ? book.initial : book.name}
                    </Text>
                  </View>

                  {/* Number Display */}
                  {isRevealed && (
                    <Animated.View 
                      style={[
                        styles.numberBadge,
                        {
                          transform: bounceAnims[bookKey] 
                            ? [{ translateY: bounceAnims[bookKey] }] 
                            : [{ translateY: 0 }]
                        }
                      ]}
                    >
                      <Text style={[
                        styles.numberText,
                        { color: getNumberColor(bookKey) }
                      ]}>
                        {book.number}
                      </Text>
                    </Animated.View>
                  )}

                  {/* Bounce Counter */}
                  {isRevealed && bounces > 0 && (
                    <View style={styles.bounceCounter}>
                      {[...Array(3)].map((_, i) => (
                        <View 
                          key={i} 
                          style={[
                            styles.bounceDot,
                            i < bounces && styles.bounceDotActive
                          ]} 
                        />
                      ))}
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Level Complete Modal */}
        {showLevelCompleteModal && (
          <View style={styles.modalOverlay}>
            <Animated.View style={styles.modalContent}>
              <Text style={styles.modalEmoji}>🎉</Text>
              <Text style={styles.modalTitle}>Level Complete!</Text>
              <Text style={styles.modalCoins}>+{POINTS_PER_LEVEL} Coins</Text>
              <Text style={styles.modalSubtitle}>Keep going!</Text>
            </Animated.View>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, currentLevel === 0 && styles.navButtonDisabled]}
            onPress={handlePreviousLevel}
            disabled={currentLevel === 0}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>

          {isLevelComplete && (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonNext]}
              onPress={handleNextLevel}
            >
              <Text style={styles.navButtonText}>
                {currentLevel === BIBLE_BOOKS.length - 1 ? 'Finish' : 'Next Level'}
              </Text>
              <Ionicons name="arrow-forward" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
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
  levelHeader: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  levelBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#FFE4D6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  levelSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  booksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  bookCard: {
    width: (width - 48) / 3,
    aspectRatio: 0.8,
    padding: 4,
    marginBottom: 8,
  },
  bookCardGradient: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bookNameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookInitial: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  bookInitialSmall: {
    fontSize: 14,
    fontWeight: '600',
  },
  numberBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 8,
    right: 8,
    elevation: 2,
  },
  numberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bounceCounter: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    gap: 4,
  },
  bounceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  bounceDotActive: {
    backgroundColor: '#fff',
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navButtonNext: {
    backgroundColor: '#FF6B35',
  },
  navButtonDisabled: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    minWidth: 250,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 10,
  },
  modalCoins: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default Index;