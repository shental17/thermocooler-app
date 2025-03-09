import React, {useState, useEffect} from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import AppInput from './AppInput';

const ElectricityTariffModal = ({visible, onClose, onSave, tariff = 0}) => {
  const theme = useTheme();
  const [tariffValue, setTariffValue] = useState(tariff || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTariffValue(tariff?.toString() || ''); // Update input when prop changes
  }, [tariff]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(Number(tariffValue)); // Save new tariff to backend
    } catch (error) {
      console.error('Error updating tariff:', error);
    }
    setLoading(false);
    onClose(); // Close modal after saving
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
      padding: theme.spacing.spacingLg,
    },
    alertBox: {
      borderRadius: theme.radius.radiusXlg,
      backgroundColor: theme.colors.surfacePrimary,
      paddingHorizontal: theme.spacing.spacingLg,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 10,
      shadowOffset: {width: 0, height: 5},
    },
    contentContainer: {
      paddingVertical: theme.spacing.spacingXlg,
      paddingHorizontal: theme.spacing.spacingXlg,
    },
    title: {
      ...textStyles.headingSmall,
      color: theme.colors.textPrimary,
    },
    buttonContainer: {
      flexDirection: 'row',
      width: '100%',
      borderTopWidth: 1,
      borderTopColor: theme.colors.toggleContainer,
    },
    button: {
      padding: theme.spacing.spacingMd,
      flex: 1,
      alignItems: 'center',
    },
    cancelText: {
      ...textStyles.subheadingLarge,
      textAlign: 'center',
      color: theme.colors.textPrimary,
    },
    saveText: {
      ...textStyles.subheadingLarge,
      textAlign: 'center',
      color: theme.colors.buttonBackgroundPrimary,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Electricity Tariff</Text>
            <AppInput
              value={tariffValue}
              onChangeText={setTariffValue}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleSave}
              style={styles.button}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator
                  color={theme.colors.buttonBackgroundPrimary}
                />
              ) : (
                <Text style={styles.saveText}>Save Changes</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ElectricityTariffModal;
