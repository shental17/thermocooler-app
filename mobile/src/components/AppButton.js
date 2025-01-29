import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {useTheme} from '../hooks/useTheme';

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
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || inactive}
      style={[
        styles.button,
        getButtonStyle(),
        {
          borderRadius,
          padding,
          width: stretch ? '100%' : 'auto',
          flexDirection: icon ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
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
          <Text style={[styles.text, {color: textColor}]}>{children}</Text>
          {icon && <View style={styles.icon}>{icon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 8,
  },
});

export default AppButton;
