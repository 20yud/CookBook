import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import Categories from '../components/categories';
import axios from 'axios';
import Recipes from '../components/recipes';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../../config";
import { db } from '../../config';
import { ref, onValue } from 'firebase/database';


export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('monAnSang');
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState();

  //Ham bo dau
  function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      // authUser sẽ là null nếu không có ai đăng nhập
      setUser(authUser);
    });

    // Hủy đăng ký sự kiện khi component bị hủy
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    getCategories();
    getRecipes(activeCategory);
  }, [search])

  const handleChangeCategory = category => {
    getRecipes(category);
    setActiveCategory(category);
  }

  const getCategories = async () => {
    try {
      const starCountRef = ref(db, 'data/' + 'categories/');
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
      // Make sure category is a string
      const categoryPath = typeof category === 'string' ? category : 'monAnSang';
      const starCountRef = ref(db, 'data/' + categoryPath);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        // Kiểm tra nếu dữ liệu không tồn tại hoặc không phải là một mảng
        if (!data || !data.meals || !Array.isArray(data.meals)) {
          console.error('Invalid data structure');
          return;
        }
        let mealList = null
        if (!search) {
          mealList = data.meals
        }

        else {
          mealList = data.meals.filter((item) => {
            let text1 = removeDiacritics(item.strMeal)
            let text2 = removeDiacritics(search)
            if (text1.includes(text2)) {
              return true
            }
            else {
              return false
            }
          })
        }

        // Trích xuất dữ liệu từ mảng meals
        const newMeals = mealList.map(meal => ({
          idMeal: meal.idMeal,
          strArea: meal.strArea,
          strCategory: meal.strCategory,

          // Add other properties you need
          strServing: meal.strServing,
          strInstructions: meal.strInstructions,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
          strIngredient1: meal.strIngredient1,
          strIngredient2: meal.strIngredient2,
          strIngredient3: meal.strIngredient3,
          strIngredient4: meal.strIngredient4,
          strIngredient5: meal.strIngredient5,
          strIngredient6: meal.strIngredient6,
          strIngredient7: meal.strIngredient7,
          strIngredient8: meal.strIngredient8,
          strIngredient9: meal.strIngredient9,
          strIngredient10: meal.strIngredient10,
          strIngredient11: meal.strIngredient11,
          strIngredient12: meal.strIngredient12,
          strIngredient13: meal.strIngredient13,
          strIngredient14: meal.strIngredient14,
          strIngredient15: meal.strIngredient15,
          strIngredient16: meal.strIngredient16,
          strIngredient17: meal.strIngredient17,
          strIngredient18: meal.strIngredient18,
          strIngredient19: meal.strIngredient19,
          strIngredient20: meal.strIngredient20,
          strMeasure1: meal.strMeasure1,
          strMeasure2: meal.strMeasure2,
          strMeasure3: meal.strMeasure3,
          strMeasure4: meal.strMeasure4,
          strMeasure5: meal.strMeasure5,
          strMeasure6: meal.strMeasure6,
          strMeasure7: meal.strMeasure7,
          strMeasure8: meal.strMeasure8,
          strMeasure9: meal.strMeasure9,
          strMeasure10: meal.strMeasure10,
          strMeasure11: meal.strMeasure11,
          strMeasure12: meal.strMeasure12,
          strMeasure13: meal.strMeasure13,
          strMeasure14: meal.strMeasure14,
          strMeasure15: meal.strMeasure15,
          strMeasure16: meal.strMeasure16,
          strMeasure17: meal.strMeasure17,
          strMeasure18: meal.strMeasure18,
          strMeasure19: meal.strMeasure19,
          strMeasure20: meal.strMeasure20,
          strSource: meal.strSource,
          strSteps: meal.strSteps,
          strTime: meal.strTime,
          strType: meal.strType
          // Add other properties you need
        }));
        // Assume setMeals là một hàm hoặc phương thức để cập nhật trạng thái React
        setMeals(newMeals);
      });
    } catch (err) {
      console.error('Error: ', err.message);
    }
  }

  const handleAvatarPress = () => {
    if (user) {
      navigation.navigate('Account');
    } else {
      navigation.navigate('Login');
    }
  };
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-14"
      >
        {/* avatar and bell icon */}
        <View className="mx-4 flex-row justify-between items-center mb-2">
          <TouchableOpacity onPress={handleAvatarPress}>
            {user ?
              <Image source={require('../../assets/images/avatar.png')} style={{ height: hp(5), width: hp(5.5) }} />
              :
              <Image source={require('../../assets/images/welcome.png')} style={{ height: hp(5), width: hp(5.5) }} />
            }
          </TouchableOpacity>
        </View>

        {/* greetings and punchline */}
        <View className="mx-4 space-y-2 mb-2">
          {user && (
            <Text style={{ fontSize: hp(1.7) }} className="text-neutral-600">
              Xin chào, {user.email}
            </Text>
          )}
          <View>
            <Text style={{ fontSize: hp(3.8) }} className="font-semibold text-neutral-600">Tự nấu các món ngon</Text>
          </View>
          <Text style={{ fontSize: hp(3.8) }} className="font-semibold text-neutral-600">
            ngay tại <Text className="text-amber-400">nhà</Text>
          </Text>
        </View>

        {/* search bar */}
        <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
          <TextInput
            placeholder='Tìm tên món ăn'
            placeholderTextColor={'gray'}
            style={{ fontSize: hp(1.7) }}
            className="flex-1 text-base mb-1 pl-3 tracking-wider"
            onChangeText={(text) => setSearch(text)}
          />
          <TouchableOpacity className="bg-white rounded-full p-3">
            <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
          </TouchableOpacity>
        </View>

        {/* categories */}
        <View>
          {categories.length > 0 && <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />}
        </View>

        {/* recipes */}
        <View>
          <Recipes meals={meals} categories={categories} />
        </View>
      </ScrollView>
    </View>
  )
}