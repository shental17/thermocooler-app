import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import EnergyUsageScreen from '../screens/EnergyUsageScreen';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{title: 'Home'}}
      />
      <Tab.Screen
        name="EnergyUsage"
        component={EnergyUsageScreen}
        options={{title: 'Energy Usage'}}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
}
