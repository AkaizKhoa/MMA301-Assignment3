import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Button } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Import axios for making API calls
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const FavouriteScreen = () => {
  const navigation = useNavigation(); // Access navigation using useNavigation hook

  const [orchids, setOrchids] = useState([]);

  const loadOrchidsFromStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const orchids = await AsyncStorage.multiGet(keys);
      const filteredOrchids = orchids
        .filter(([key, value]) => key.startsWith('orchid_'))
        .map(([key, value]) => JSON.parse(value));
      setOrchids(filteredOrchids);
    } catch (error) {
      console.error('Error loading orchids from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadOrchidsFromStorage);

    return unsubscribe;
  }, [navigation]);

  const removeOrchid = async (id) => {
    try {
      await AsyncStorage.removeItem(`orchid_${id}`);
      setOrchids(prevOrchids => prevOrchids.filter(orchid => orchid.id !== id));
      await updateOrchidStatus(id, false); // Call API to update status to false
    } catch (error) {
      console.error('Error removing orchid from AsyncStorage:', error);
    }
  };

  const clearAllOrchids = async () => {
    try {
      await AsyncStorage.multiRemove(orchids.map(orchid => `orchid_${orchid.id}`));
      setOrchids([]);
      await Promise.all(orchids.map(orchid => updateOrchidStatus(orchid.id, false))); // Call API to update status to false for all orchids
    } catch (error) {
      console.error('Error clearing all orchids from AsyncStorage:', error);
    }
  };

  const updateOrchidStatus = async (id, status) => {
    try {
      await axios.put(`https://65d33d39522627d5010860d0.mockapi.io/api/orchids/orchids/${id}`, { status });
    } catch (error) {
      console.error('Error updating orchid status:', error);
    }
  };

  const renderOrchidItem = ({ item }) => (
    <View style={styles.orchidItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.orchidName}>{item.name}</Text>
      <TouchableOpacity onPress={() => removeOrchid(item.id)}>
        <Feather name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orchids}
        renderItem={renderOrchidItem}
        keyExtractor={item => item.id.toString()}
      />
      <Button title="Clear All" onPress={clearAllOrchids} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  orchidItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  orchidName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
});

export default FavouriteScreen;
