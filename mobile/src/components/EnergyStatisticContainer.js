import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import EnergyStatisticBar from './EnergyStatisticBar';

const EnergyStatisticContainer = ({dailyEnergy}) => {
  const theme = useTheme();

  const maxEnergy = Math.max(...Object.values(dailyEnergy), 1);

  const getLast7Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setUTCDate(today.getUTCDate() - i);
      date.setUTCHours(8, 0, 0, 0);

      const formattedDate = date.toISOString().split('T')[0];

      const dayName = date
        .toLocaleDateString('en-MY', {
          weekday: 'short',
          timeZone: 'Asia/Kuala_Lumpur',
        })
        .toUpperCase();
      const dayDate = date.getDate({
        day: 'numeric',
        timeZone: 'Asia/Kuala_Lumpur',
      });

      days.push({day: dayName, date: dayDate, formattedDate});
    }

    return days;
  };

  const last7Days = getLast7Days();

  const styles = StyleSheet.create({
    container: {
      gap: theme.spacing.spacingXlg,
      alignSelf: 'stretch',
      justifyContent: 'center',
      padding: theme.spacing.spacingMd,
      borderRadius: theme.radius.radiusMd,
      backgroundColor: theme.colors.navContainer,
    },
    headerText: {
      ...textStyles.headingLarge,
      color: theme.colors.textPrimary,
    },
    mainContainer: {
      display: 'flex',
      alignItems: 'center',
      alignSelf: 'stretch',
      justifyContent: 'center',
      gap: theme.spacing.spacingLg,
      flexDirection: 'row',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Statistics</Text>
      <View style={styles.mainContainer}>
        {last7Days.map((item, index) => (
          <EnergyStatisticBar
            key={index}
            energy={dailyEnergy[item.formattedDate] || 0} // Example energy values
            maxEnergy={maxEnergy}
            date={item.date}
            day={item.day}
          />
        ))}
      </View>
    </View>
  );
};

export default EnergyStatisticContainer;
