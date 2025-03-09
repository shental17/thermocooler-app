import React from 'react';
import {TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import Icon from 'react-native-vector-icons/FontAwesome';

const TemperatureButton = ({
  backgroundColor,
  disabled = false,
  inactive = false,
  filled = true,
  icon = null,
  onPress,
}) => {
  const theme = useTheme();

  // Set default values using the theme
  backgroundColor = backgroundColor || theme.colors.buttonBackgroundPrimary;
  const paddingHorizontal = theme.spacing.spacing2xl;
  const paddingVertical = theme.spacing.spacingMd;
  const borderRadius = borderRadius || theme.radius.radiusXlg;
  const textColor = theme.colors.buttonLabelPrimary;

  const getButtonStyle = () => {
    if (disabled) return {backgroundColor: '#d3d3d3'}; // Gray for disabled state
    if (inactive) return {backgroundColor: '#f0f0f0'}; // Light gray for inactive state
    return {backgroundColor};
  };

  return (
    <TouchableOpacity
      onPress={() => {
        if (onPress) {
          onPress();
        }
      }}
      activeOpacity={0.7}
      disabled={disabled || inactive}
      style={[
        styles.button,
        getButtonStyle(),
        {
          borderRadius,
          paddingHorizontal: paddingHorizontal,
          paddingVertical: paddingVertical,
          alignItems: 'center',
        },
        !filled && {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: backgroundColor,
        },
      ]}>
      {inactive ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>{icon && <Icon name={icon} size={12} color={textColor} />}</>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
});

export default TemperatureButton;
