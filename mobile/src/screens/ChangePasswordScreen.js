import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert, SafeAreaView} from 'react-native';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import IconButton from '../components/IconButton';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import {useAuthContext} from '../hooks/useAuthContext';
import {useChangePassword} from '../hooks/useChangePassword';

const ChangePasswordScreen = ({navigation}) => {
  const {user} = useAuthContext();
  const theme = useTheme();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const {changePassword, isLoading, error, isSuccess} = useChangePassword();

  useEffect(() => {
    if (!user) {
      navigation.navigate('Auth');
    }
  }, [user, navigation]);

  useEffect(() => {
    if (isSuccess) {
      Alert.alert(
        'Success',
        'Your password has been changed successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Profile');
            },
          },
        ],
        {cancelable: false},
      );
    }
  }, [isSuccess, navigation]);

  const handleChangePassword = async () => {
    await changePassword(password, newPassword, confirmNewPassword);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surfacePrimary,
      display: 'flex',
      flex: 1,
    },
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'stretch',
      paddingVertical: theme.spacing.spacingXs,
      paddingHorizontal: theme.spacing.spacingLg,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: theme.radius.radiusXlg,
      borderBottomRightRadius: theme.radius.radiusXlg,
      backgroundColor: theme.colors.navContainer,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    mainContainer: {
      padding: theme.spacing.spacingXlg,
      gap: theme.spacing.spacingXlg,
    },
    contentContainer: {
      gap: theme.spacing.spacingXs,
      alignItems: 'center',
    },
    descriptionText: {
      ...textStyles.bodyTextLarge,
      color: theme.colors.textPrimary,
    },
    inputContainer: {
      gap: theme.spacing.spacingNone,
      alignSelf: 'stretch',
    },
    errorText: {
      color: theme.colors.error,
      ...textStyles.bodyTextSmall,
      marginLeft: theme.spacing.spacingXxs,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <IconButton onPress={() => navigation.navigate('Profile')} />
        <Text
          style={{
            ...textStyles.mainHeadingSmall,
            color: theme.colors.textPrimary,
          }}>
          Change Password
        </Text>
        <IconButton disabled={true} />
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.descriptionText}>
            Your password must be at least 8 characters and should include a
            combination of numbers, letters and special characters (!$@%)
          </Text>
          <View style={styles.inputContainer}>
            <AppInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={true}
            />
            {error && error.password && (
              <Text style={styles.errorText}>{error.password}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <AppInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password"
              secureTextEntry={true}
            />
            {error && error.newPassword && (
              <Text style={styles.errorText}>{error.newPassword}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <AppInput
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="Confirm New Password"
              secureTextEntry={true}
            />
            {error && error.confirmNewPassword && (
              <Text style={styles.errorText}>{error.confirmNewPassword}</Text>
            )}
          </View>
        </View>
        <AppButton
          onPress={() => {
            handleChangePassword();
          }}
          disabled={isLoading}>
          {isLoading ? 'Changing Password...' : 'Change Password'}
        </AppButton>
      </View>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
