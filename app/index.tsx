import React, { Component, useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, KeyboardAvoidingView} from 'react-native'
import { Image } from 'react-native'
import { Button } from '@react-navigation/elements'
import { TextInput } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router'
import { useGameStore } from './userStore'


function index() {
  const [name, setName] = useState('');
  const setGlobalName = useGameStore((state) => state.setPlayerName);


  const saveName = async () => {
    try {
      await AsyncStorage.setItem('playerName', name);
      // console.log('Name saved successfully');
    } catch (error) {
      console.log('Error saving name:', error);
    }
  };

const startGame = async () => {
    await saveName();
    setGlobalName(name); // 3. Set it globally before navigating!
    router.push('/stages');
  };

  const loadName = async () => {
    try {
      const storedName = await AsyncStorage.getItem('playerName');
      if (storedName !== null) {
        setName(storedName);
        // console.log('Name loaded successfully:', storedName);
      }
    } catch (error) {
      console.log('Error loading name:', error);
    }
  };

  useEffect(() => {
    loadName();
  }, []);

  
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {/* <Text style={{fontSize: 24, fontWeight: 'bold'}} className=''> Bible Quest game</Text> */}
        <Image source={require('../assets/images/splash.png')} 
          style={{width: 370, height: 370, marginTop: 0}} 
        />
        <KeyboardAvoidingView behavior="padding" >
        <TextInput placeholder="Enter your name" 
        value={name}
        onChangeText={(text) => setName(text)}
          style={{height: 40, borderColor: 'gray', borderWidth: 1, marginTop: -30, paddingLeft: 10, width: 200, borderRadius: 5}} 
        />
        </KeyboardAvoidingView>
        <TouchableOpacity style={{padding: 10, paddingHorizontal:50, marginTop: 10, borderRadius: 5, backgroundColor: 'orange'}} 
        onPress={startGame}>
          <Text style={{fontSize: 13, fontWeight: 'bold', fontFamily: 'Arial', color: 'white'}}>Start Game</Text>
        </TouchableOpacity>
      </View>
    )
  }


export default index
