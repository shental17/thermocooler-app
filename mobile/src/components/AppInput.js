import React, {useState} from 'react';
import {TextInput, StyleSheet, View, TouchableOpacity} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import Icon from 'react-native-vector-icons/FontAwesome';

const AppInput = ({
  value,
  onChangeText,
  placeholder,
  backgroundColor,
  borderColor,
  borderRadius,
  padding,
  textColor,
  placeholderTextColor,
  stretch = true,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
}) => {
  const theme = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  backgroundColor = backgroundColor || theme.colors.navContainer;
  borderColor = borderColor || theme.colors.navContainer;
  borderRadius = borderRadius || theme.radius.radiusMd;
  padding = padding || theme.spacing.spacingMd;
  textColor = textColor || theme.colors.textPrimary;
  placeholderTextColor = placeholderTextColor || theme.colors.textSecondary;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
          borderRadius,
          padding,
          width: stretch ? '100%' : 'auto',
        },
      ]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={!isPasswordVisible}
        style={[textStyles.bodyTextLarge, styles.input, {color: textColor}]}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
      />
      {secureTextEntry && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.iconContainer}>
          <Icon
            name={isPasswordVisible ? 'eye' : 'eye-slash'}
            size={24}
            color={textColor}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 0, // Adjust padding to ensure text is not cut off
    textAlignVertical: 'center', // Vertically center the text
  },
  icon: {
    marginLeft: 8,
  },
});

export default AppInput;
