import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import AppInput from '../components/AppInput';
import {useAuthContext} from '../hooks/useAuthContext';
import AppButton from '../components/AppButton';
import {useLogout} from '../hooks/useLogout';
import {useUpdateUserProfile} from '../hooks/useUpdateUserProfile';
import {launchImageLibrary} from 'react-native-image-picker';

const ProfileScreen = ({navigation}) => {
  const {user} = useAuthContext();
  const {logout} = useLogout();
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const {updateUserProfile, isLoading, error, isSuccess} =
    useUpdateUserProfile();

  useEffect(() => {
    if (isSuccess) {
      Alert.alert('Success', 'Profile updated successfully.');
      setIsEditing(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Auth');
    } else {
      setUsername(user.username);
      setEmail(user.email);
      setProfilePicture(user.profilePicture);
    }
  }, [user, navigation]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUsername(user.username);
    setEmail(user.email);
    setProfilePicture(user.profilePicture);
  };

  const handleSave = async () => {
    console.log('Saving Profile');
    await updateUserProfile(username, email, profilePicture);
    console.log('Update Profile Successful');
  };
  const handleSelectPhoto = () => {
    launchImageLibrary(
      {mediaType: 'photo', includeBase64: true},
      async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          try {
            const base64Image = await fetch(selectedImage.uri)
              .then(res => res.blob())
              .then(blob => {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result);
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });
              });
            setProfilePicture(base64Image);
          } catch (error) {
            console.log('Error resizing image: ', error);
          }
        }
      },
    );
  };
  const handleLogout = () => {
    logout();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.spacingXlg,
      backgroundColor: theme.colors.surfacePrimary,
      alignItems: 'center',
      gap: theme.spacing.spacingXlg,
    },
    headerContainer: {
      padding: theme.spacing.spacingMd,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'flex-end',
    },
    headerRight: {
      textAlign: 'right',
    },
    headerRightText: {
      color: theme.colors.buttonBackgroundPrimary,
      ...textStyles.subheadingSmall,
    },
    headerLeft: {
      flex: 1,
    },
    headerLeftText: {
      color: theme.colors.error,
      ...textStyles.subheadingSmall,
    },
    image: {
      aspectRatio: 1,
      height: 100,
      borderRadius: 50,
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing.spacingMd,
    },
    detailsContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
      gap: theme.spacing.spacingMd,
    },
    inputContainer: {
      alignItems: 'stretch',
      alignSelf: 'stretch',
      gap: theme.spacing.spacingXxs,
    },
    inputLabel: {
      ...textStyles.subheadingSmall,
      color: theme.colors.textSecondary,
    },
    errorText: {
      ...textStyles.bodyTextSmall,
      color: theme.colors.error,
      marginLeft: theme.spacing.spacingSm,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {isEditing && (
          <TouchableOpacity style={styles.headerLeft} onPress={handleCancel}>
            <Text style={styles.headerLeftText}>Cancel</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.headerRight}
          onPress={() => {
            if (isEditing) {
              handleSave();
            }
            handleEditToggle();
          }}>
          <Text style={styles.headerRightText}>
            {isEditing ? 'Done' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{uri: profilePicture || 'https://via.placeholder.com/100'}}
          style={styles.image}
        />
        {isEditing && (
          <TouchableOpacity onPress={handleSelectPhoto}>
            <Text style={[styles.headerRightText, textStyles.subheadingSmall]}>
              Set New Photo
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <AppInput
            value={username}
            onChangeText={setUsername}
            editable={isEditing}
          />
          {error && error.username && (
            <Text style={styles.errorText}>{error.username}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <AppInput
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
          />
          {error && error.email && (
            <Text style={styles.errorText}>{error.email}</Text>
          )}
        </View>

        {!isEditing && (
          <>
            <AppButton
              icon="scissors"
              onPress={() => console.log('Pressed Save')}>
              Change Password
            </AppButton>
            <AppButton
              backgroundColor={theme.colors.error}
              icon="sign-out"
              onPress={() => {
                handleLogout();
              }}>
              Logout
            </AppButton>
          </>
        )}
      </View>
    </View>
  );
};

export default ProfileScreen;
