import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import {useAuthContext} from '../hooks/useAuthContext';
import HeaderContainer from '../components/HeaderContainer';
import CurrentReadingsContainer from '../components/CurrentReadingsContainer';
import AppButton from '../components/AppButton';
import TemperatureControl from '../components/TemperatureControl';
import FanSpeedSlider from '../components/FanSpeedSlider';
import {useThermocooler} from '../hooks/useThermocooler';

const ThermocoolerScreen = ({navigation, route}) => {
  const {thermocoolerId} = route.params;
  const {user} = useAuthContext();
  const theme = useTheme();
  const {
    getThermocooler,
    updatePowerState,
    updateSetTemperature,
    updateFanSpeed,
    thermocoolerData,
    isLoading,
    error,
    isSuccess,
  } = useThermocooler();
  const powerUsage = 488;
  const minTemperature = 18;
  const maxTemperature = 26;
  const [name, setName] = useState(null);
  const [currentTemperature, setCurrentTemperature] = useState(30);
  const [powerState, setPowerState] = useState(false);
  const [temperature, setTemperature] = useState(20);
  const [fanSpeed, setFanSpeed] = useState(25);

  const handlePowerChange = async newState => {
    setPowerState(newState); // Update power state
    await updatePowerState(thermocoolerId, newState);
  };

  const handleTemperatureChange = async newTemperature => {
    setTemperature(newTemperature);
    await updateSetTemperature(thermocoolerId, newTemperature);
  };

  // Handle fan speed change
  const handleFanSpeedChange = async newFanSpeed => {
    setFanSpeed(newFanSpeed);
    await updateFanSpeed(thermocoolerId, newFanSpeed[0]);
  };

  useEffect(() => {
    if (!user) {
      navigation.navigate('Auth');
    }
  }, [user, navigation]);

  // Fetch thermocooler data when the screen loads
  useEffect(() => {
    getThermocooler(thermocoolerId);
  }, []);

  useEffect(() => {
    if (thermocoolerData) {
      setName(thermocoolerData.name);
      setCurrentTemperature(thermocoolerData.currentTemperature);
      setPowerState(thermocoolerData.powerState);
      setTemperature(thermocoolerData.setTemperature);
      setFanSpeed(thermocoolerData.fanSpeed);
    }
  }, [thermocoolerData]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surfacePrimary,
      alignItems: 'center',
      gap: theme.spacing.spacingXlg,
    },
    contentContainer: {
      alignSelf: 'stretch',
      alignItems: 'center',
      gap: theme.spacing.spacingXlg,
    },
    headerContainer: {
      padding: theme.spacing.spacingXlg,
      backgroundColor: theme.colors.navContainer,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 1,
      shadowRadius: 4,
    },
  });

  return (
    <View style={styles.container}>
      <HeaderContainer
        thermocoolerName={name}
        navigation={navigation}
        powerState={powerState}
        onPowerChange={handlePowerChange}
      />
      <CurrentReadingsContainer
        currentTemperature={currentTemperature}
        powerUsage={powerUsage}
        disabled={!powerState}
      />
      <View style={styles.contentContainer}>
        <TemperatureControl
          temperature={temperature}
          minTemperature={minTemperature}
          maxTemperature={maxTemperature}
          disabled={!powerState}
          onTemperatureChange={handleTemperatureChange}
        />
        <FanSpeedSlider
          fanSpeedValue={fanSpeed}
          disabled={!powerState}
          onChange={handleFanSpeedChange}
        />
        <AppButton onPress={() => navigation.navigate('Home')}>
          Go to Home Screen
        </AppButton>
      </View>
    </View>
  );
};

export default ThermocoolerScreen;
