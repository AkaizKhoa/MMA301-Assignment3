import React, { useState, useEffect } from "react";
import axios from "axios";
import { View, Text, ImageBackground, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [orchid, setOrchid] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
    axios.get(`https://65d33d39522627d5010860d0.mockapi.io/api/orchids/orchids/${id}`)
      .then(response => {
        setOrchid(response.data);
        setIsFavorite(response.data.status);
      })
      .catch(error => {
        console.error('Error fetching orchid details:', error);
      });
    });
      
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);

  
  const toggleFavorite = async () => {
    try {
      const newStatus = !isFavorite;

      // Update favorite status in API
      await axios.put(`https://65d33d39522627d5010860d0.mockapi.io/api/orchids/orchids/${id}`, {
        status: newStatus ? true : false
      });

      // Update orchid status in AsyncStorage
      if (newStatus) {
        await AsyncStorage.setItem(`orchid_${id}`, JSON.stringify({ id, status: 1, image: orchid.image, name: orchid.name }));
      } else {
        await AsyncStorage.removeItem(`orchid_${id}`);
      }

      // Update orchid status in the local state
      setIsFavorite(newStatus);
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  return (
    <ImageBackground
      source={orchid ? { uri: orchid.image } : null}
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <View style={styles.container}>
        <Image source={orchid ? { uri: orchid.image } : null} style={styles.image} />
        <Text style={styles.name}>{orchid ? orchid.name : ''}</Text>
        <Text style={styles.description}>{orchid ? orchid.description : ''}</Text>
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <Icon
            name={isFavorite ? 'favorite' : 'favorite-outline'}
            size={30}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    borderWidth: 5,
    borderColor: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: 'black',
  },
  favoriteButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});
