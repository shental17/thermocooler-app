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
  onTemperatureChange,
}) => {
  const theme = useTheme();

  const handleIncrease = () => {
    const newTemp = Math.min(temperature + 1, maxTemperature);
    onTemperatureChange(newTemp);
  };

  const handleDecrease = () => {
    const newTemp = Math.max(temperature - 1, minTemperature);
    onTemperatureChange(newTemp);
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
        temperature={temperature}
        minTemperature={minTemperature}
        maxTemperature={maxTemperature}
        disabled={disabled}
      />
      <View style={styles.buttonContainer}>
        <TemperatureButton
          onPress={handleDecrease}
          disabled={disabled || temperature <= minTemperature}
          icon="minus"
        />
        <TemperatureButton
          onPress={handleIncrease}
          disabled={disabled || temperature >= maxTemperature}
          icon="plus"
        />
      </View>
    </>
  );
};

export default TemperatureControl;
