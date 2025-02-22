import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import {useAuthContext} from '../hooks/useAuthContext';
import AppButton from '../components/AppButton';

const HomeScreen = ({navigation}) => {
  const {user} = useAuthContext();
  const theme = useTheme();

  useEffect(() => {
    if (!user) {
      navigation.navigate('Auth');
    }
  }, [user, navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.spacingXlg,
      backgroundColor: theme.colors.surfacePrimary,
      alignItems: 'center',
      gap: theme.spacing.spacingXlg,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={textStyles.headerText}>Home Screen</Text>
      <Text style={textStyles.bodyText}>
        This is a simple home screen. You can add more components here.
      </Text>
      <AppButton onPress={() => navigation.navigate('Thermocooler')}>
        Go to Thermocooler Screen
      </AppButton>
    </View>
  );
};

export default HomeScreen;
