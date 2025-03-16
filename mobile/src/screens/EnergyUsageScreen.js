import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import {useAuthContext} from '../hooks/useAuthContext';
import {useEnergyUsage} from '../hooks/useEnergyUsage';
import EnergySummaryContainer from '../components/EnergySummaryContainer';
import EnergyStatisticContainer from '../components/EnergyStatisticContainer';
import ElectricityTariffModal from '../components/ElectricityTariffModal';
import IconButton from '../components/IconButton';

const EnergyUsageScreen = ({navigation}) => {
  const {user} = useAuthContext();
  const theme = useTheme();
  const {
    getElectricityTariff,
    updateElectricityTariff,
    getEnergyUsage,
    electricityTariff,
    todayEnergy,
    dailyEnergy,
    monthlyEnergy,
    isLoading,
    error,
    isSuccess,
  } = useEnergyUsage();
  const [tariff, setTariff] = useState(electricityTariff || 0);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Auth');
    } else {
      const fetchEnergyData = async () => {
        await getElectricityTariff(); // Fetch electricity tariff
        await getEnergyUsage();
      };
      fetchEnergyData();
    }
  }, [user, navigation]);

  // Update tariff state whenever electricityTariff is fetched
  useEffect(() => {
    if (electricityTariff !== undefined) {
      setTariff(parseFloat(electricityTariff)); // Ensure it's a number
    }
  }, [electricityTariff]);

  // Update total cost whenever the tariff or electricityTariff changes
  useEffect(() => {
    if (tariff !== null && !isNaN(tariff)) {
      setTotalCost(((monthlyEnergy / 1000) * tariff).toFixed(2)); // Calculate total cost
    }
  }, [tariff, monthlyEnergy]);

  const handleSaveTariff = async newTariff => {
    const numericTariff = parseFloat(newTariff); // Ensure it's a number
    if (!isNaN(numericTariff)) {
      await updateElectricityTariff(numericTariff); // Save to backend
      setTariff(numericTariff); // Update local state
    }
    setModalVisible(false); // Close modal after saving
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surfacePrimary,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
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
              onSave={handleSaveTariff}
              tariff={tariff !== null ? tariff.toFixed(2) : 'Loading...'}
            />
          </View>
          <EnergySummaryContainer
            todayEnergy={todayEnergy}
            monthlyEnergy={monthlyEnergy}
            totalCost={totalCost}
          />
          <EnergyStatisticContainer dailyEnergy={dailyEnergy} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default EnergyUsageScreen;
