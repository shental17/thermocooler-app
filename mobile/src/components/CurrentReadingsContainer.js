import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import Icon from 'react-native-vector-icons/FontAwesome';

const CurrentReadingsContainer = ({
  currentTemperature,
  powerUsage,
  disabled = false,
}) => {
  const theme = useTheme();

  const temperatureColor = disabled
    ? theme.colors.textPrimary
    : theme.colors.error;
  const powerColor = disabled ? theme.colors.textPrimary : theme.colors.warning;

  const styles = StyleSheet.create({
    paddingContainer: {
      paddingHorizontal: theme.spacing.spacingXlg,
      alignSelf: 'stretch',
    },
    container: {
      alignSelf: 'stretch',
      padding: theme.spacing.spacingMd,
      borderRadius: theme.radius.radiusMd,
      gap: theme.spacing.spacingMd,
      backgroundColor: theme.colors.navContainer,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    contentContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    rowContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      paddingHorizontal: theme.spacing.spacingSm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    textContainer: {
      color: theme.colors.textPrimary,
      ...textStyles.subheadingSmall,
    },
  });

  return (
    <View style={styles.paddingContainer}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.rowContainer}>
            <Icon
              style={styles.iconContainer}
              name={'thermometer-half'}
              size={24}
              color={temperatureColor}
            />
            <Text style={styles.textContainer}>Current Temperature</Text>
          </View>
          <Text style={[styles.textContainer, {color: temperatureColor}]}>
            {currentTemperature}°C
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.rowContainer}>
            <Icon
              style={styles.iconContainer}
              name={'bolt'}
              size={24}
              color={powerColor}
            />
            <Text style={styles.textContainer}>Power Usage</Text>
          </View>
          <Text style={[styles.textContainer, {color: powerColor}]}>
            {powerUsage} kW
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CurrentReadingsContainer;
