import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import EnergyUsageScreen from '../screens/EnergyUsageScreen';
import ProfileStack from './ProfileStack';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'EnergyUsage') {
            iconName = 'bar-chart';
          } else if (route.name === 'ProfileTab') {
            iconName = 'user';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.selected,
        tabBarInactiveTintColor: theme.colors.navIcon,
        tabBarStyle: {
          backgroundColor: theme.colors.navContainer,
          padding: theme.spacing.spacingLg,
          paddingTop: theme.spacing.spacingXs,
        },
      })}>
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
