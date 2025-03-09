import React from 'react';
import {TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import Icon from 'react-native-vector-icons/FontAwesome';

const IconButton = ({
  isNavButton = true,
  icon = 'arrow-left',
  size = 18,
  isSelected = false,
  onPress,
  disabled = false,
  border = false,
}) => {
  const theme = useTheme();

  // Set default values using the them;
  const backgroundColor = isNavButton
    ? 'transparent'
    : isSelected
    ? theme.colors.buttonBackgroundPrimary
    : theme.colors.toggleContainer;
  const textColor = isNavButton
    ? theme.colors.navIcon
    : isSelected
    ? theme.colors.toggleContainer
    : theme.colors.toggleButton;

  return (
    <TouchableOpacity
      onPress={() => {
        if (onPress && !disabled) {
          onPress();
        }
      }}
      activeOpacity={0.7}
      style={[
        styles.button,
        !isNavButton && styles.powerButton,
        border && {borderWidth: 1, borderColor: textColor},
        {
          borderRadius: theme.spacing.spacingXlg,
          padding: theme.spacing.spacingMd,
          alignItems: 'center',
          backgroundColor: backgroundColor,
          opacity: disabled ? 0 : 1,
        },
      ]}
      disabled={disabled}>
      {icon && <Icon name={icon} size={size} color={textColor} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  powerButton: {
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default IconButton;
