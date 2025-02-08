import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';

const Stack = createStackNavigator();

export default function ProfileStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          headerShown: true,
          title: 'Change Password',
          headerStyle: {
            backgroundColor: theme.colors.surfacePrimary,
            borderBottomLeftRadius: theme.radius.radiusLg,
            borderBottomRightRadius: theme.radius.radiusLg,
            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          },
          headerTitleStyle: {
            color: theme.colors.textPrimary,
            ...textStyles.subheadingLarge,
          },
        }}
      />
    </Stack.Navigator>
  );
}
