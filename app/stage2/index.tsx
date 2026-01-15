import React, { Component, useState } from 'react'
import { Text, View } from 'react-native'
import GameHeader from '../header'
import { SafeAreaView } from 'react-native-safe-area-context'

function index() {
    return (
        <SafeAreaView>
            <GameHeader  coins={100}/>
            <Text>Stage 2 Screen</Text>
        </SafeAreaView>
    )
  
}

export default index
