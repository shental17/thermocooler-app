import React from 'react';
import {Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import Icon from 'react-native-vector-icons/FontAwesome';

const RoomButton = ({name, thermocoolerId, navigation, onDelete}) => {
  const roomImages = {
    'Living Room': require('../assets/livingRoom.png'),
    'Main Bedroom': require('../assets/mainBedroom.png'),
    Bedroom: require('../assets/bedroom.png'),
    Office: require('../assets/office.png'),
    Study: require('../assets/study.png'),
  };
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      borderRadius: theme.radius.radiusXlg,
      overflow: 'hidden',
    },
    name: {
      position: 'absolute',
      top: '30%',
      right: '20%',
      color: theme.colors.textPrimary,
      ...textStyles.headingSmall,
    },
    deleteButton: {
      backgroundColor: theme.colors.error,
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      height: '100%',
      borderRadius: theme.radius.radiusXlg,
    },
    deleteText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  // Render the delete button when swiped left
  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => onDelete(thermocoolerId)}>
      <Icon name="trash-o" size={18} color={theme.colors.textPrimary} />
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => navigation.navigate('Thermocooler', {thermocoolerId})}>
        <Image source={roomImages[name]} />
        <Text style={styles.name}>{name}</Text>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default RoomButton;
