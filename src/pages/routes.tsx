import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import ListEvents from "./ListEvents";
import ShowEvent from "./ShowEvent";
import ScanQrCode from "./ScanQrCode";
import FeedBackScanQrCode from "./FeedBackScanQrCode";

export default function Routes() {
   return (
      <NavigationContainer>
         <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="ListEvents" component={ListEvents} />
            <Stack.Screen name="ShowEvent" component={ShowEvent} />
            <Stack.Screen name="ScanQrCode" component={ScanQrCode} />
            <Stack.Screen name="FeedBackScanQrCode" component={FeedBackScanQrCode} />
         </Stack.Navigator>
      </NavigationContainer>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
});
