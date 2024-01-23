import * as React from 'react';
//import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyDiskScreen from '../screens/MyDiskScreen';
import FavoriteDishScreen from '../screens/FavoriteDishScreen';

const Tab = createMaterialTopTabNavigator();

function AccountNavigation() {
  return (
      <Tab.Navigator>
        <Tab.Screen name="Món Yêu Thích" component={FavoriteDishScreen} />
        <Tab.Screen name="Món Của Tôi" component={MyDiskScreen} />
      </Tab.Navigator>
  );
}
export default AccountNavigation;