import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import Icon from 'react-native-vector-icons/FontAwesome';

const AppButton = ({
  backgroundColor,
  disabled = false,
  inactive = false,
  filled = true,
  icon = null,
  stretch = true,
  padding,
  borderRadius,
  children,
  textColor,
  onPress,
}) => {
  const theme = useTheme();

  // Set default values using the theme
  backgroundColor = backgroundColor || theme.colors.buttonBackgroundPrimary;
  padding = padding || theme.spacing.spacingMd;
  borderRadius = borderRadius || theme.radius.radiusMd;
  textColor = textColor || theme.colors.buttonLabelPrimary;

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
          padding,
          width: stretch ? '100%' : 'auto',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: icon ? 'space-between' : 'center',
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
        <>
          <Text style={[textStyles.bodyTextLarge, {color: textColor}]}>
            {children}
          </Text>
          {icon && (
            <Icon name={icon} size={24} color={textColor} style={styles.icon} />
          )}
        </>
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
  icon: {
    marginLeft: 8,
  },
});

export default AppButton;
