import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useEffect } from 'react';
import { audioManager } from './audioSystem';


export default function RootLayout() {
  // const [playerName, setPlayerName] = useState('Guest');
  useEffect(() => {
    // Start music when the app loads
    audioManager.playBackgroundMusic();

    // Optional: Stop music when the app closes
    return () => {
      audioManager.stopBackgroundMusic();
    };
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
