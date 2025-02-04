import React from 'react';
import {AuthContextProvider} from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';

export default function App() {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthContextProvider>
  );
}
