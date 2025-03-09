import {View, StyleSheet} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';

const AppSelect = ({
  value,
  onValueChange,
  items,
  placeholder = 'Select an option',
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.navContainer,
          borderColor: theme.colors.navContainer,
          borderRadius: theme.radius.radiusMd,
          padding: theme.spacing.spacingMd,
          width: '100%',
        },
      ]}>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={items}
        value={value}
        placeholder={{label: placeholder, value: null}}
        style={{
          inputIOS: [
            textStyles.bodyTextLarge,
            {color: theme.colors.textPrimary},
          ],
          inputAndroid: [
            textStyles.bodyTextLarge,
            {color: theme.colors.textPrimary},
          ],
        }}
        useNativeAndroidPickerStyle={false}
        Icon={() => {
          return (
            <Icon
              name="chevron-down"
              size={18}
              color={theme.colors.textPrimary}
            />
          );
        }}
      />
    </View>
  );
};

export default AppSelect;
