import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {BellIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import { StatusBar } from 'expo-status-bar'
import axios from 'axios';
import Recipes from '../components/recipes';

export default function FavoriteDishScreen() {
    const [categories, setCategories] = useState([]);
    const [meals, setMeals] = useState([]);
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
            {/* recipes */}
            <View>
              <Recipes meals={meals} categories={categories} />
            </View>
          </ScrollView>
        </View>

    )

}