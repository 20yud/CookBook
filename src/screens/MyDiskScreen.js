import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {BellIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import { StatusBar } from 'expo-status-bar'
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import axios from 'axios';
import Recipes from '../components/recipes';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../../config";
import { db } from '../../config';
import { ref, onValue, get, DataSnapshot, getDatabase} from 'firebase/database';
import Categories from '../components/categories';


export default function MyDiskScreen() {
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState('monAnSang');


    const handleChangeCategory = category => {
      getRecipes(category);
      setActiveCategory(category);
    }
    
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (authUser) => {
        setUser(authUser);
      });
  
      // Fetch categories regardless of user authentication state
      getCategories();
  
      // Call getRecipes after user state is updated
      if (user) {
        getRecipes();
      }
  
      // Cleanup on component unmount
      return () => {
        unsubscribe();
      };
    }, [user]);


    const getCategories = async () => {
      try {
        const starCountRef = ref(db, 'data/' + 'categories/' );
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
  
          // Kiểm tra nếu dữ liệu không tồn tại hoặc không phải là một mảng
          if (!data || !data.categories || !Array.isArray(data.categories)) {
            console.error('Invalid data structure');
            return;
          }
  
          // Trích xuất dữ liệu từ mảng categories
          const newCategories = data.categories.map(category => ({
            id: category.idCategory,
            strCategory: category.strCategory,
            strCategoryThumb: category.strCategoryThumb,
            strName: category.strName
          }));
  
          // Assume setCategories là một hàm hoặc phương thức để cập nhật trạng thái React
          setCategories(newCategories);
        });
      } catch (err) {
        console.error('Error: ', err.message);
      }
    }
  
    
    const getRecipes = async (category = 'monAnSang') => {
      try {
        const categoryPath = typeof category === 'string' ? category : 'monAnSang';
        
        const starCountRef = ref(db, 'data/' + categoryPath);
        
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
    
          if (!data || !data.meals || !Array.isArray(data.meals)) {
            console.error('Invalid data structure');
            return;
          }
    
          // Filter meals based on user's strArea
          const userStrArea = user ? user.uid : ''; // Change this to the correct property
    
          const newMeals = data.meals
            .filter(meal => meal.struserID === userStrArea)
            .map(meal => ({
              id: meal.idMeal,
              strArea: meal.strArea,
              strCategory: meal.strCategory,
              strIngredient1: meal.strIngredient1,
              strInstructions: meal.strInstructions,
              strMeal: meal.strMeal,
              strMealThumb: meal.strMealThumb,
              strMeasure1: meal.strMeasure1,
              strSource: meal.strSource,
              strSteps: meal.strSteps,
              strTime: meal.strTime,
              strType: meal.strType
            }));
    
          setMeals(newMeals);
        });
      } catch (err) {
        console.error('Error: ', err.message);
      }
    }
    const getUserData = async () => {
      try {
        const dbRef = ref(getDatabase(), 'users/');
        const snapshot = await get(dbRef);
    
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersArray = Object.values(usersData);
    
          // Assuming user is not null and has a uid
          const targetUserID = user.uid;
    
          // Find the user with the matching userID or userId (case-insensitive)
          const targetUser = usersArray.find(userData => {
            const lowerCaseUserID = userData.userID ? userData.userID.toLowerCase() : '';
            const lowerCaseUserId = userData.userId ? userData.userId.toLowerCase() : '';
            return lowerCaseUserID === targetUserID.toLowerCase() || lowerCaseUserId === targetUserID.toLowerCase();
          });
    
          if (targetUser) {
            const targetUserName = targetUser.userName;
            console.log("User ID:", targetUserID);
            console.log("User Name:", targetUserName);
          } else {
            console.warn(`User with userID ${targetUserID} not found`);
          }
        } else {
          console.warn("No data found at the specified path");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };
    
    


    return (
        <View className="flex-1 bg-white">
          <StatusBar style="dark" />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 50}}
            className="space-y-6 pt-10"
          >
            {/* search bar */}
          

            <Animated.View entering={FadeInDown.delay(300).duration(700).springify().damping(12)} className="space-y-4">
              <TouchableOpacity className="bg-yellow-400 mx-20 items-center rounded-full p-[6px]" onPress={()=> navigation.navigate('Create')}>
                <Text className="text-xl font-bold text-center text-gray-700">Viết món mới</Text>
              </TouchableOpacity>
              
            </Animated.View>
            {/* recipes */}
            <View>
              <View>
                {categories.length > 0 && <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />}
              </View>
              <View>
                <Recipes meals={meals} categories={categories} />
              </View>
            </View>
          </ScrollView>
        </View>

    )
}