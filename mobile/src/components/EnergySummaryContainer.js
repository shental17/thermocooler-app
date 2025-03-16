import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import Icon from 'react-native-vector-icons/FontAwesome';

const EnergySummaryContainer = ({
  todayEnergy,
  monthlyEnergy,
  totalCost = 0,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      gap: theme.spacing.spacingXlg,
      alignSelf: 'stretch',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.spacingXlg,
      borderRadius: theme.radius.radiusMd,
      backgroundColor: theme.colors.containerPrimary,
    },
    energyIconContainer: {
      padding: theme.spacing.spacingXxs,
      justifyContent: 'center',
      alignItems: 'center',
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: theme.colors.buttonBackgroundPrimary,
    },
    descriptionContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      gap: theme.spacing.spacingXs,
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    valueContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.spacing.spacingXxs,
    },
    text: {
      ...textStyles.subheadingSmall,
      color: theme.colors.textPrimary,
    },
    highlightText: {
      ...textStyles.headingSmall,
      color: theme.colors.warning,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.energyIconContainer}>
        <Icon name="bolt" size={48} color={theme.colors.warning} />
      </View>
      <View style={styles.descriptionContainer}>
        <View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Today</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.highlightText}>
                {(todayEnergy / 1000).toFixed(3)}
              </Text>
              <Text style={styles.text}>kWh</Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>This Month</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.highlightText}>
                {(monthlyEnergy / 1000).toFixed(3)}
              </Text>
              <Text style={styles.text}>kWh</Text>
            </View>
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Total Cost</Text>
          <Text style={styles.highlightText}>${totalCost}</Text>
        </View>
      </View>
    </View>
  );
};

export default EnergySummaryContainer;
