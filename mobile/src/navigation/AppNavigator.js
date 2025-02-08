import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuthContext} from '../hooks/useAuthContext';
import AuthStack from './AuthStack';
import MainTabs from './MainTab';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const {user} = useAuthContext();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
