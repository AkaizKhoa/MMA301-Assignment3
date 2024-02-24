import React, { useState, useEffect } from "react";
import axios from "axios";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
    const [orchids, setOrchids] = useState([]);

    React.useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            axios.get('https://65d33d39522627d5010860d0.mockapi.io/api/orchids/orchids')
            .then(response => {
                setOrchids(response.data);
            })
            .catch(error => {
                console.error('Error fetching orchids:', error);
            });
          });
      
          // Return the function to unsubscribe from the event so it gets removed on unmount
          return unsubscribe;


       
    }, []);

    const toggleFavorite = async (id, currentStatus, image, name) => {
        try {
            const newStatus = !currentStatus;
            // Update favorite status in API
            await axios.put(`https://65d33d39522627d5010860d0.mockapi.io/api/orchids/orchids/${id}`, {
                status: newStatus
            });

            // Update orchid status in AsyncStorage
            if (newStatus) {
                await AsyncStorage.setItem(`orchid_${id}`, JSON.stringify({ id, status: newStatus, image, name }));
            } else {
                await AsyncStorage.removeItem(`orchid_${id}`);
            }

            // Update orchid status in the local state
            setOrchids(prevOrchids => prevOrchids.map(orchid => {
                if (orchid.id === id) {
                    return { ...orchid, status: newStatus };
                }
                return orchid;
            }));
        } catch (error) {
            console.error('Error toggling favorite status:', error);
        }
    };


    
    return (
        <View style={styles.container}>
            <FlatList
                style={styles.listCard}
                data={orchids}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index, }) => (
                    <View style={{ width: "100%", height: "auto", }}>
                        <View style={styles.containerCard}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('DetailScreen', {
                                        id: item.id,
                                    });
                                }}
                            >
                                <Text style={{ width: "100%", fontSize: 20, backgroundColor: "#416D19", textAlign: "center", height: 50, }}>Detail</Text>
                            </TouchableOpacity>
                            <View style={{ width: "auto", backgroundColor: "#BFEA7C", marginVertical: 10 }}>
                                <Text style={{ width: "100%", fontSize: 20, fontWeight: "700", textAlign: "center" }}>{item.name}</Text>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 3, alignItems: "center" }}>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: item.image }}
                                    />
                                </View>
                                <View style={{ flex: 1, alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
                                    <TouchableOpacity onPress={() => toggleFavorite(item.id, item.status,  item.image, item.name,)}>
                                        <View style={{ width: 50, height: 50, borderWidth: 1, borderColor: "#000", alignItems: "center", flexDirection: "column", justifyContent: "center", borderRadius: 10, backgroundColor: "#fff" }}>
                                            <Icon
                                                name={item.status === true ? "favorite" : "favorite-outline"}
                                                size={30}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#fff",
        fontSize: 20,
    },
    listCard: {
        width: "90%",
        marginVertical: 10
    },
    containerCard: {
        width: "100%",
        borderRadius: 20,
        marginVertical: 40,
        height: 280,
        backgroundColor: "#FFF67E",
        flexDirection: "column-reverse",
    },
    image: {
        width: "100%",
        height: 200,
        position: "relative",
        top: -15,
        borderRadius: 20
    }
});
