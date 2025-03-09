import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import {useAuthContext} from '../hooks/useAuthContext';
import EnergySummaryContainer from '../components/EnergySummaryContainer';
import EnergyStatisticContainer from '../components/EnergyStatisticContainer';
import ElectricityTariffModal from '../components/ElectricityTariffModal';
import IconButton from '../components/IconButton';

const EnergyUsageScreen = ({navigation}) => {
  const {user} = useAuthContext();
  const theme = useTheme();
  const [tariff, setTariff] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const monthEnergy = 100;

  useEffect(() => {
    if (!user) {
      navigation.navigate('Auth');
    }
  }, [user, navigation]);

  useEffect(() => {
    setTotalCost(monthEnergy * tariff.toFixed(2));
  }, [tariff]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surfacePrimary,
    },
    mainContainer: {
      padding: theme.spacing.spacingXlg,
      gap: theme.spacing.spacingXlg,
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    headerText: {
      ...textStyles.headingMedium,
      color: theme.colors.textPrimary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Energy Consumption</Text>
          <IconButton
            icon="edit"
            border={true}
            onPress={() => setModalVisible(true)}
          />
          <ElectricityTariffModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSave={setTariff}
            tariff={tariff.toFixed(2)}
          />
        </View>
        <EnergySummaryContainer
          todayEnergy={'10'}
          monthlyEnergy={'100'}
          totalCost={totalCost}
        />
        <EnergyStatisticContainer />
      </View>
    </SafeAreaView>
  );
};

export default EnergyUsageScreen;
