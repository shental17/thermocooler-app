import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import {useAuthContext} from '../hooks/useAuthContext';
import HeaderContainer from '../components/HeaderContainer';
import CurrentReadingsContainer from '../components/CurrentReadingsContainer';
import AppButton from '../components/AppButton';
import TemperatureControl from '../components/TemperatureControl';
import FanSpeedSlider from '../components/FanSpeedSlider';

const ThermocoolerScreen = ({navigation}) => {
  const {user} = useAuthContext();
  const theme = useTheme();
  const currentTemperature = 30;
  const powerUsage = 488;
  const temperature = 20;
  const minTemperature = 18;
  const maxTemperature = 26;
  const fanSpeedValue = 25;
  const [powerState, setPowerState] = useState(false);

  const handlePowerChange = newState => {
    setPowerState(newState); // Update power state
  };

  useEffect(() => {
    console.log('Updated Power State: ' + powerState);
  }, [powerState]); // This will run when powerState changes

  useEffect(() => {
    if (!user) {
      navigation.navigate('Auth');
    }
  }, [user, navigation]);

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
        thermocoolerName="Living Room"
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
        />
        <FanSpeedSlider fanSpeedValue={fanSpeedValue} disabled={!powerState} />
        <AppButton onPress={() => navigation.navigate('Home')}>
          Go to Home Screen
        </AppButton>
      </View>
      {/* <Text style={textStyles.headerText}>Thermocooler Screen</Text>
      <Text style={textStyles.bodyText}>
        This is a simple thermocooler screen. You can add more components here.
      </Text> */}
    </View>
  );
};

export default ThermocoolerScreen;
