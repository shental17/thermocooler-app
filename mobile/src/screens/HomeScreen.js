import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {useTheme} from '../hooks/useTheme';
import textStyles from '../styles/textStyle';
import {useAuthContext} from '../hooks/useAuthContext';
import {useThermocoolerList} from '../hooks/useThermocoolerList';
import IconButton from '../components/IconButton';
import RoomButton from '../components/RoomButton';

const HomeScreen = ({navigation}) => {
  const {user} = useAuthContext();
  const theme = useTheme();
  const {
    getAllThermocooler,
    deleteThermocooler,
    allThermocoolerData,
    isLoading,
    error,
    isSuccess,
  } = useThermocoolerList();
  const [allThermocoolersData, setAllThermocoolersData] = useState(null);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Auth');
    }
  }, [user, navigation]);

  useEffect(() => {
    getAllThermocooler();
  }, [user]);

  useEffect(() => {
    if (allThermocoolerData) {
      setAllThermocoolersData(allThermocoolerData);
    }
  }, [allThermocoolerData]);

  const handleDeleteRoom = thermocoolerId => {
    deleteThermocooler(thermocoolerId);
    setAllThermocoolersData(prevData =>
      prevData.filter(item => item._id !== thermocoolerId),
    );
  };

  const renderRoom = ({item}) => (
    <RoomButton
      name={item.name}
      thermocoolerId={item._id}
      navigation={navigation}
      onDelete={() => handleDeleteRoom(item._id)}
    />
  );

  const ItemSeparator = () => (
    <View style={{height: theme.spacing.spacingSm}} />
  );

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surfacePrimary,
      alignItems: 'center',
      gap: theme.spacing.spacingXlg,
    },
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: theme.spacing.spacingMd,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.spacingXlg,
    },
    headerTextContainer: {
      flex: 1,
    },
    profileImage: {
      width: 72,
      height: 72,
      borderRadius: 36,
    },
    headerMainText: {
      ...textStyles.headingMedium,
      color: theme.colors.textPrimary,
    },
    headerSubText: {
      ...textStyles.bodyTextLarge,
      color: theme.colors.textSecondary,
    },
    roomContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.spacingXlg,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={{
            uri: user.profilePicture || 'https://via.placeholder.com/100',
          }}
          style={styles.profileImage}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerMainText}>Hello, {user.username}</Text>
          <Text style={styles.headerSubText}>{getGreeting()}</Text>
        </View>
        <IconButton
          icon="plus"
          color={theme.colors.textPrimary}
          border={true}
          onPress={() => navigation.navigate('AddThermocooler')}
        />
      </View>
      <FlatList
        data={allThermocoolersData}
        renderItem={renderRoom}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.roomContainer}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
