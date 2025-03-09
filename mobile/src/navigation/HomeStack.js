import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ThermocoolerScreen from '../screens/ThermocoolerScreen';
import AddThermocoolerScreen from '../screens/AddThermocoolerScreen';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Thermocooler" component={ThermocoolerScreen} />
      <Stack.Screen name="AddThermocooler" component={AddThermocoolerScreen} />
    </Stack.Navigator>
  );
}
