import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert, SafeAreaView} from 'react-native';
import {useAuthContext} from '../hooks/useAuthContext';
import {useThermocoolerList} from '../hooks/useThermocoolerList';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import AppInput from '../components/AppInput';
import AppSelect from '../components/AppSelect';
import IconButton from '../components/IconButton';
import AppButton from '../components/AppButton';

const AddThermocoolerScreen = ({navigation}) => {
  const {user} = useAuthContext();
  const theme = useTheme();
  const [esp32Address, setEsp32Address] = useState(null);
  const [thermocoolerName, setThermocoolerName] = useState('');
  const {addThermocooler, isLoading, error, isSuccess} = useThermocoolerList();

  useEffect(() => {
    if (!user) {
      navigation.navigate('Auth');
    }
  }, [user, navigation]);

  useEffect(() => {
    if (isSuccess) {
      Alert.alert('Thermocooler added successfully');
      navigation.navigate('Home');
    }
  }, [isSuccess, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert(error.response?.data?.error || 'Failed to add thermocooler');
    }
  }, [error]);

  const handleAddThermocooler = async () => {
    await addThermocooler(thermocoolerName, esp32Address);
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
    detailsContainer: {
      alignItems: 'center',
      alignSelf: 'stretch',
      gap: theme.spacing.spacingMd,
      padding: theme.spacing.spacingXlg,
      flex: 1,
    },
    footerContainer: {
      alignItems: 'center',
      padding: theme.spacing.spacingXlg,
    },
    inputContainer: {
      alignItems: 'stretch',
      alignSelf: 'stretch',
      gap: theme.spacing.spacingXxs,
    },
    inputLabel: {
      ...textStyles.subheadingSmall,
      color: theme.colors.textPrimary,
    },
    descriptionText: {
      ...textStyles.bodyTextLarge,
      color: theme.colors.textPrimary,
    },
    errorText: {
      ...textStyles.bodyTextSmall,
      color: theme.colors.error,
      marginLeft: theme.spacing.spacingSm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <IconButton onPress={() => navigation.navigate('Home')} />
        <Text
          style={{
            ...textStyles.mainHeadingSmall,
            color: theme.colors.textPrimary,
          }}>
          Add Thermocooler
        </Text>
        <IconButton disabled={true} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.descriptionText}>
          Please select a room name and enter the ESP32 MAC address of the
          thermocooler.
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Room Name</Text>
          <AppSelect
            value={thermocoolerName}
            onValueChange={setThermocoolerName}
            items={[
              {label: 'Living Room', value: 'Living Room'},
              {label: 'Main Bedroom', value: 'Main Bedroom'},
              {label: 'Bedroom', value: 'Bedroom'},
              {label: 'Office', value: 'Office'},
              {label: 'Study', value: 'Study'},
            ]}
            placeholder="Select Room Name"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>ESP32 MAC Address</Text>
          <AppInput value={esp32Address} onChangeText={setEsp32Address} />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>
      <View style={styles.footerContainer}>
        <AppButton
          onPress={handleAddThermocooler}
          isLoading={isLoading}
          disabled={isLoading}>
          Add Thermocooler
        </AppButton>
      </View>
    </SafeAreaView>
  );
};

export default AddThermocoolerScreen;
