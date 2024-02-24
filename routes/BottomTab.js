import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import IconEntypo from 'react-native-vector-icons/Entypo';


import HomeScreen from '../screens/HomeScreen';
import FavouriteScreen from '../screens/FavouriteScreen'

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  
  return (
    <Tab.Navigator
    screenOptions={{
      headerTransparent: true,
      tabBarShowLabel: false,
      headerShown: false,
      tabBarStyle: {
        backgroundColor: "transparent",
        borderTopWidth: 0,
        elevation: 0,
        overflow: "hidden",
      },
    }}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen}
       options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name='home' size={size} color={"#416D19"}></Icon>
          ),
        }}
      />
      <Tab.Screen name="Favourite" component={FavouriteScreen} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <IconEntypo name='list' size={size} color={"#416D19"}></IconEntypo>
        ),
      }}/>
    </Tab.Navigator>
  );
};

export default BottomTab;
