import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import AppButton from '../components/AppButton';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import homeLightImage from '../assets/homeLight.png';
import homeDarkImage from '../assets/homeDark.png';

export default function WelcomeScreen({navigation}) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.spacingXlg,
      backgroundColor: theme.colors.surfacePrimary,
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.spacingLg,
    },
    image: {
      width: '100%',
      aspectRatio: 1,
      resizeMode: 'contain',
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      marginBottom: theme.spacing.spacingLg,
      color: theme.colors.textPrimary,
    },
    buttonContainer: {
      gap: theme.spacing.spacingXlg,
      alignSelf: 'stretch',
      alignItems: 'center',
    },
  });

  let imageSource;
  switch (theme.homeImageUrl) {
    case '../assets/homeDark.png':
      imageSource = homeDarkImage;
      break;
    default:
      imageSource = homeLightImage;
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={[textStyles.mainHeadingSmall, styles.title]}>
          Welcome!
        </Text>
        <View style={styles.buttonContainer}>
          <AppButton
            onPress={() => {
              console.log('Pressed Login');
              navigation.navigate('Login');
            }}>
            Login
          </AppButton>
          <AppButton
            backgroundColor={theme.colors.navContainer}
            textColor={theme.colors.textSecondary}
            onPress={() => {
              console.log('Pressed Sign Up');
              navigation.navigate('SignUp');
            }}>
            Sign Up
          </AppButton>
        </View>
      </View>
    </View>
  );
}
