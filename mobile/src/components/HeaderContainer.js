import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import IconButton from './IconButton';

const HeaderContainer = ({
  thermocoolerName = '',
  navigation,
  powerState = 'false',
  onPowerChange,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'flex-start',
      alignSelf: 'stretch',
      paddingVertical: theme.spacing.spacingXlg,
      paddingHorizontal: theme.spacing.spacingLg,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: theme.radius.radiusXlg,
      borderBottomRightRadius: theme.radius.radiusXlg,
      backgroundColor: theme.colors.navContainer,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    contentContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    textContainer: {
      paddingVertical: theme.spacing.spacingNone,
      paddingHorizontal: theme.spacing.spacingSm,
      color: theme.colors.textPrimary,
    },
  });

  return (
    <View style={styles.container}>
      <IconButton onPress={() => navigation.navigate('Home')} />
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={{...textStyles.headingMedium}}>Thermocooler</Text>
          <Text style={{...textStyles.subheadingSmall}}>
            {thermocoolerName}
          </Text>
        </View>
        <IconButton
          isNavButton={false}
          icon="power-off"
          isSelected={powerState}
          onPress={() => onPowerChange(!powerState)}
        />
      </View>
    </View>
  );
};

export default HeaderContainer;
