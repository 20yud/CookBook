import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {BellIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import { StatusBar } from 'expo-status-bar'
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import axios from 'axios';
import Recipes from '../components/recipes';
import { useNavigation } from '@react-navigation/native';

export default function MyDiskScreen() {
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const navigation = useNavigation();
    useEffect(()=>{
      getRecipes();
    },[])
    const getRecipes = async (category="Beef")=>{
      try{
        const response = await axios.get(`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        // console.log('got recipes: ',response.data);
        if(response && response.data){
          setMeals(response.data.meals);
        }
      }catch(err){
        console.log('error: ',err.message);
      }
    }
    return (
        <View className="flex-1 bg-white">
          <StatusBar style="dark" />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 50}}
            className="space-y-6 pt-10"
          >
            {/* search bar */}
            <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
                <TextInput
                    placeholder='Tìm tên món ăn'
                    placeholderTextColor={'gray'}
                    style={{fontSize: hp(1.7)}}
                    className="flex-1 text-base mb-1 pl-3 tracking-wider"
                />
                <View className="bg-white rounded-full p-3">
                    <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
                </View>
            </View>

            <Animated.View entering={FadeInDown.delay(300).duration(700).springify().damping(12)} className="space-y-4">
              <TouchableOpacity className="bg-yellow-400 mx-20 items-center rounded-full p-[6px]" onPress={()=> navigation.navigate('Create')}>
                <Text className="text-xl font-bold text-center text-gray-700">Viết món mới</Text>
              </TouchableOpacity>
            </Animated.View>
            {/* recipes */}
            <View>
              <Recipes meals={meals} categories={categories} />
            </View>
          </ScrollView>
        </View>

    )
}