import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import Icon from 'react-native-vector-icons/FontAwesome';

const FanSpeedSlider = ({fanSpeedValue, onChange, disabled = false}) => {
  const [value, setValue] = useState(fanSpeedValue); // Initial slider value
  const theme = useTheme();

  useEffect(() => {
    setValue(fanSpeedValue); // Update local state when fanSpeedValue prop changes
  }, [fanSpeedValue]);

  const handleValueChange = newValue => {
    setValue(newValue); // Update local state
    if (onChange) {
      onChange(newValue); // Pass the value to the parent component
    }
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.spacingXlg,
      width: '100%',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.spacingSm,
      alignSelf: 'stretch',
      marginBottom: theme.spacing.spacingXs,
    },
    iconContainer: {
      padding: theme.spacing.spacingSm,
      borderRadius: theme.radius.radiusXlg,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.toggleContainer,
    },
    label: {
      color: theme.colors.textPrimary,
      ...textStyles.headingSmall,
    },
    fanSpeedLabel: {
      color: theme.colors.textPrimary,
      ...textStyles.subheadingSmall,
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...textStyles.headingSmall,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon
          style={styles.iconContainer}
          name={'gear'}
          size={24}
          color={
            disabled ? theme.colors.textSecondary : theme.colors.toggleButton
          }
        />
        <Text style={styles.label}>Fan Speed</Text>
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.fanSpeedLabel}>Low</Text>
        <Text style={styles.fanSpeedLabel}>Medium</Text>
        <Text style={styles.fanSpeedLabel}>High</Text>
      </View>
      <Slider
        style={{width: '100%'}}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={value}
        onValueChange={handleValueChange}
        minimumTrackTintColor={
          disabled ? theme.colors.textSecondary : theme.colors.selected
        }
        maximumTrackTintColor={
          disabled ? theme.colors.toggleContainer : theme.colors.toggleButton
        }
        thumbTintColor={
          disabled ? theme.colors.textSecondary : theme.colors.selected
        }
        thumbStyle={{
          width: theme.spacing.spacing2xl,
          height: theme.spacing.spacing2xl,
          borderRadius: theme.radius.radiusLg,
        }}
        trackStyle={{
          height: theme.spacing.spacingMd,
          borderRadius: theme.radius.radiusSm,
        }}
        disabled={disabled}
      />
    </View>
  );
};

export default FanSpeedSlider;
