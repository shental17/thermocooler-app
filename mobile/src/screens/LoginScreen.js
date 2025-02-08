import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import {useTheme} from '../hooks/useTheme';
import {useLogin} from '../hooks/useLogin';
import textStyles from '../styles/textStyle';
import homeLightImage from '../assets/homeLight.png';
import homeDarkImage from '../assets/homeDark.png';

const LoginScreen = ({navigation}) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login, isLoading, error} = useLogin();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.spacingXlg,
      backgroundColor: theme.colors.surfacePrimary,
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.spacingMd,
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
      marginBottom: theme.spacing.spacingSm,
    },
    buttonContainer: {
      gap: theme.spacing.spacingSm,
      alignSelf: 'stretch',
      marginBottom: theme.spacing.spacingMd,
    },
    inputContainer: {
      gap: theme.spacing.spacingNone,
      alignSelf: 'stretch',
    },
    errorText: {
      color: theme.colors.error,
      marginLeft: theme.spacing.spacingSm,
    },
  });

  const handleLogin = async () => {
    await login(email, password);
    if (error) {
      console.log(error);
    }
  };

  let imageSource;
  switch (theme.homeImageUrl) {
    case './assets/homeDark.png':
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
        <Text
          style={[
            styles.title,
            textStyles.mainHeadingSmall,
            {textAlign: 'left'},
          ]}>
          Welcome!
        </Text>
        <Text
          style={[
            styles.title,
            textStyles.subheadingSmall,
            {textAlign: 'left'},
          ]}>
          Login now to use your smart home!
        </Text>

        <View style={styles.buttonContainer}>
          <View style={styles.inputContainer}>
            <AppInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email Address"
              keyboardType="email-address"
            />
            {error.email && (
              <Text style={[textStyles.bodyTextSmall, styles.errorText]}>
                {error.email}
              </Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <AppInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={true}
            />
            {error.password && (
              <Text style={[textStyles.bodyTextSmall, styles.errorText]}>
                {error.password}
              </Text>
            )}
          </View>

          {error.general && (
            <Text style={[textStyles.bodyTextSmall, styles.errorText]}>
              {error.general}
            </Text>
          )}

          <AppButton onPress={handleLogin} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </AppButton>
        </View>

        <Text style={[styles.title, textStyles.bodyTextSmall]}>
          Don't have an account?{' '}
          <Text
            style={{color: theme.colors.primary}}
            onPress={() => navigation.navigate('SignUp')}>
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
