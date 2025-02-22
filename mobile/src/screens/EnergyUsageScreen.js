import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import {useAuthContext} from '../hooks/useAuthContext';
import Slider from '@react-native-community/slider';

const EnergyUsageScreen = ({navigation}) => {
  const {user} = useAuthContext();
  const theme = useTheme();
  const disabled = false;
  useEffect(() => {
    if (!user) {
      navigation.navigate('Auth');
    }
  }, [user, navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.spacingXlg,
      backgroundColor: theme.colors.surfacePrimary,
      alignItems: 'center',
      gap: theme.spacing.spacingXlg,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={textStyles.headerText}>Energy Usage Screen</Text>
      <Text style={textStyles.bodyText}>
        This is a simple energy usage screen. You can add more components here.
      </Text>
      <Slider
        style={{width: 200, height: 40}}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />
    </View>
  );
};

export default EnergyUsageScreen;
