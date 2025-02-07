import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import AppModal from '../components/AppModal';
import {useTheme} from '../hooks/useTheme';
import {useSignup} from '../hooks/useSignup';
import textStyles from '../styles/textStyle';

const LoginScreen = ({navigation}) => {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {signup, isLoading, error, isSuccess} = useSignup();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      Alert.alert(
        'Success',
        'Your account has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ],
        {cancelable: false},
      );
    }
  }, [isSuccess, navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.spacingXlg,
      backgroundColor: theme.colors.surfacePrimary,
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing.spacing3xl,
    },
    headerContainer: {
      gap: theme.spacing.spacingSm,
      alignItems: 'center',
    },
    contentContainer: {
      gap: theme.spacing.spacingSm,
      alignSelf: 'stretch',
      marginBottom: theme.spacing.spacingMd,
    },
    inputContainer: {
      gap: theme.spacing.spacingNone,
      alignSelf: 'stretch',
    },
    errorText: {
      ...textStyles.bodyTextSmall,
      color: theme.colors.error,
      marginLeft: theme.spacing.spacingSm,
    },
  });

  const handleSignup = async () => {
    console.log('username: ', username);
    console.log('email: ', email);
    console.log('password: ', password);
    console.log('confirmPassword: ', confirmPassword);
    await signup(username, email, password, confirmPassword);
    if (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={textStyles.mainHeadingSmall}>Welcome!</Text>
        <Text style={textStyles.subheadingSmall}>
          Sign Up Now to get started!
        </Text>

        <View style={styles.contentContainer}>
          <View style={styles.inputContainer}>
            <AppInput
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
            />
            {error.username && (
              <Text style={styles.errorText}>{error.username}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <AppInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email Address"
              keyboardType="email-address"
            />
            {error.email && <Text style={styles.errorText}>{error.email}</Text>}
          </View>
          <View style={styles.inputContainer}>
            <AppInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={true}
            />
            {error.password && (
              <Text style={styles.errorText}>{error.password}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <AppInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              secureTextEntry={true}
            />
            {error.confirmPassword && (
              <Text style={styles.errorText}>{error.confirmPassword}</Text>
            )}
          </View>

          <AppButton onPress={handleSignup} disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </AppButton>
        </View>

        <Text style={textStyles.bodyTextSmall}>
          Have an account?{' '}
          <Text
            style={{color: theme.colors.primary}}
            onPress={() => navigation.navigate('Login')}>
            Login
          </Text>
        </Text>
      </View>

      <AppModal
        visible={modalVisible}
        message="Signup Successful!"
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default LoginScreen;
