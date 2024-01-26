import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BellIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { StatusBar } from 'expo-status-bar'
import axios from 'axios';
import Recipes from '../components/recipes';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../../config";
import { db } from '../../config';
import { ref, onValue } from 'firebase/database';


export default function FavoriteDishScreen() {
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      // authUser sẽ là null nếu không có ai đăng nhập
      setUser(authUser);
    });

    // Hủy đăng ký sự kiện khi component bị hủy
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (user) {
      getFavorites(user.uid);
    }
  }, [user])

  const getFavorites = async (uid) => {
    try {
      const usersRef = ref(db, 'users');
      onValue(usersRef, (snapshot) => {
        const usersData = snapshot.val();
        // Kiểm tra nếu dữ liệu không tồn tại hoặc không phải là một mảng
        if (usersData && Array.isArray(usersData)) {
          const userIndex = usersData.findIndex(user => user && user.userID === uid);
          if (userIndex !== -1 && usersData[userIndex].favorites) {
            const favoriteData = usersData[userIndex].favorites;
            for (let i = 0; i < favoriteData.length; i++) {
              if (favoriteData[i] == undefined || favoriteData[i] == null) { continue }
              else { getMealData(favoriteData[i].idMeal - 1, favoriteData[i].strCategory); }
            }
          } else {
            console.log('User not found or has no favorite data.');
            return null;
          }
        } else {
          console.log('Invalid users data structure.');
          return null;
        }
      })
    } catch (err) {
      console.error('Error: ', err.message);
    }
  }
  const getMealData = async (id, category) => {
    try {
      const dataRef = ref(db, 'data/' + category + '/meals/' + id);
      onValue(dataRef, (snapshot) => {
        const meal = snapshot.val();
        // Kiểm tra nếu dữ liệu không tồn tại
        if (meal == null && meal == undefined) {
          console.error('Invalid data structure');
          return;
        }
        setMeals(meals => [...meals, meal]);
      });
    } catch (err) {
      console.log('error: ', err.message);
    }
  }
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-10"
      >
        {/* search bar */}
        <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
          <TextInput
            placeholder='Tìm tên món ăn'
            placeholderTextColor={'gray'}
            style={{ fontSize: hp(1.7) }}
            className="flex-1 text-base mb-1 pl-3 tracking-wider"
          />
          <View className="bg-white rounded-full p-3">
            <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
          </View>
        </View>
        {/* recipes */}
        <View>
          <Recipes meals={meals} categories={categories} />
        </View>
      </ScrollView>
    </View>

  )

}