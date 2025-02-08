import {useColorScheme} from 'react-native';
import {lightTheme, darkTheme} from '../commons/constants';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};
