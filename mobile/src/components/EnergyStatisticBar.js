import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';

const EnergyStatisticBar = ({
  energy = 10,
  maxEnergy = 100,
  date = 16,
  day = 'MON',
}) => {
  const theme = useTheme();
  const statsHeight = (energy / maxEnergy) * 99 + 1 + '%';

  const styles = StyleSheet.create({
    container: {
      gap: theme.spacing.spacingSm,
      alignSelf: 'stretch',
    },
    statsValueContainer: {
      display: 'flex',
      flexDirection: 'column-reverse',
      alignItems: 'center',
      alignSelf: 'stretch',
      height: 200,
    },
    statsValue: {
      borderRadius: theme.radius.radiusXs,
      backgroundColor: theme.colors.buttonBackgroundPrimary,
      height: statsHeight,
      alignSelf: 'stretch',
    },
    textContainer: {
      alignItems: 'center',
    },
    text: {
      ...textStyles.smallText,
      color: theme.colors.textPrimary,
    },
    energyText: {
      ...textStyles.captionText,
      color: theme.colors.textPrimary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.energyText}>{(energy / 1000).toFixed(3)}</Text>
        <Text style={styles.text}>kWh</Text>
      </View>
      <View style={styles.statsValueContainer}>
        <View style={styles.statsValue}></View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{date}</Text>
        <Text style={styles.text}>{day}</Text>
      </View>
    </View>
  );
};

export default EnergyStatisticBar;
