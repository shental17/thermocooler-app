import React from 'react';
import {TextInput, StyleSheet, View, Text} from 'react-native';
import {useTheme} from '../hooks/useTheme';

const AppInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error = false,
  icon = null,
  label,
  style,
  ...props
}) => {
  const theme = useTheme();

  // Set default values using the theme
  const inputBackgroundColor = disabled ? '#d3d3d3' : theme.colors.navContainer;
  const inputBorderColor = error
    ? theme.colors.error
    : theme.colors.navContainer;
  const textColor = disabled ? '#a9a9a9' : theme.colors.textSecondary;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, {color: textColor}]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: inputBackgroundColor,
            borderColor: inputBorderColor,
          },
        ]}>
        <TextInput
          {...props}
          style={[styles.input, {color: textColor}]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholder}
        />
        {icon && <View style={styles.icon}>{icon}</View>}
      </View>
      {error && <Text style={styles.errorText}>This field is required.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    marginLeft: 8,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 4,
  },
});

export default AppInput;
