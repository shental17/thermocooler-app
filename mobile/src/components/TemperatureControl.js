import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import TemperatureControlCircle from './TemperatureControlCircle';
import TemperatureButton from './TemperatureButton';

const TemperatureControl = ({
  temperature,
  minTemperature,
  maxTemperature,
  disabled = false,
}) => {
  const theme = useTheme();
  const [targetTemperature, setTargetTemperature] = useState(temperature);

  const handleIncrease = () => {
    setTargetTemperature(prevTemp => Math.min(prevTemp + 1, maxTemperature));
  };

  const handleDecrease = () => {
    setTargetTemperature(prevTemp => Math.max(prevTemp - 1, minTemperature));
  };

  const textColor = disabled ? theme.colors.textPrimary : theme.colors.selected;

  const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      gap: '40%',
    },
    text: {
      ...textStyles.headingSmall,
      color: textColor,
      alignSelf: 'flex-start',
      paddingLeft: theme.spacing.spacingXlg,
    },
  });
  return (
    <>
      <Text style={styles.text}>Set Temperature</Text>
      <TemperatureControlCircle
        temperature={targetTemperature}
        minTemperature={minTemperature}
        maxTemperature={maxTemperature}
        disabled={disabled}
      />
      <View style={styles.buttonContainer}>
        <TemperatureButton
          onPress={handleDecrease}
          disabled={disabled || targetTemperature <= minTemperature}
          icon="minus"
        />
        <TemperatureButton
          onPress={handleIncrease}
          disabled={disabled || targetTemperature >= maxTemperature}
          icon="plus"
        />
      </View>
    </>
  );
};

export default TemperatureControl;
