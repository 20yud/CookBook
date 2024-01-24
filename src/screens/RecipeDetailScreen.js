import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { CachedImage } from '../helpers/image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon, ClockIcon } from 'react-native-heroicons/outline';
import { HeartIcon, Square3Stack3DIcon, UsersIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Loading from '../components/loading';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Platform } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../../config";
import { db } from '../../config';
import { ref, onValue } from 'firebase/database';

const ios = Platform.OS == 'ios';



export default function RecipeDetailScreen(props) {
    let item = props.route.params;
    const [isFavourite, setIsFavourite] = useState(false);
    const navigation = useNavigation();
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
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
        getMealData(item.strCategory + '/', item.id - 1);
    }, [])

    const handleFavoritePress = async () => {
        if (user) {
            setIsFavourite(!isFavourite)
        } else {
            navigation.navigate('Login');
        }
    };

    const getMealData = async (category, id) => {
        try {
            const mealsRef = ref(db, 'data/' + category + 'meals/' + id);
            console.log('data/' + category + 'meals/' + id)
            onValue(mealsRef, (snapshot) => {
                const mealData = snapshot.val();
                console.log('mealData:', mealData);
                // Check if the data exists and has the expected structure
                if (!mealData || !mealData.idMeal) {
                    console.error('Invalid meal data structure');
                    return;
                }

                // Transform the mealData to match your expected structure
                const transformedMeal = {
                    idMeal: mealData.idMeal,
                    strArea: mealData.strArea,
                    strCategory: mealData.strCategory,
                    // Add other properties you need
                    strServing: mealData.strServing,
                    strInstructions: mealData.strInstructions,
                    strMeal: mealData.strMeal,
                    strMealThumb: mealData.strMealThumb,
                    strMeasure1: mealData.strMeasure1,
                    strSource: mealData.strSource,
                    strSteps: mealData.strSteps,
                    strTime: mealData.strTime,
                    strType: mealData.strType,
                    // Add other properties you need
                };

                console.log(transformedMeal);
                // Assume setMeal is a function to update the React state
                setMeal(transformedMeal);
                setLoading(false);
            });
        } catch (err) {
            console.error('Error: ', err.message);
        }
    }

    const ingredientsIndexes = (meal) => {
        if (!meal) return [];
        let indexes = [];
        for (let i = 1; i <= 20; i++) {
            if (meal['strIngredient' + i]) {
                indexes.push(i);
            }
        }

        return indexes;
    }

    return (
        <View className="flex-1 bg-white relative">
            <StatusBar style={"light"} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            >

                {/* recipe image */}
                <View className="flex-row justify-center">
                    <CachedImage
                        uri={item.strMealThumb}
                        // sharedTransitionTag={item.strMeal} // this will only work on native image (now using Image from expo-image)
                        style={{ width: wp(100), height: hp(50), borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}

                    />
                </View>

                {/* back button */}
                <Animated.View entering={FadeIn.delay(200).duration(1000)} className="w-full absolute flex-row justify-between items-center pt-14">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded-full ml-5 bg-white">
                        <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#fbbf24" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleFavoritePress} className="p-2 rounded-full mr-5 bg-white">
                        <HeartIcon size={hp(3.5)} strokeWidth={4.5} color={isFavourite ? "red" : "gray"} />
                    </TouchableOpacity>
                </Animated.View>

                {/* meal description */}
                {
                    loading ? (
                        <Loading size="large" className="mt-16" />
                    ) : (
                        <View className="px-4 flex justify-between space-y-4 pt-8">
                            {/* name and area */}
                            <Animated.View entering={FadeInDown.duration(700).springify().damping(12)} className="space-y-2">
                                <Text style={{ fontSize: hp(3) }} className="font-bold flex-1 text-neutral-700">
                                    {meal?.strMeal}
                                </Text>
                                <Text style={{ fontSize: hp(2) }} className="font-medium flex-1 text-neutral-500">
                                    {meal?.strArea}
                                </Text>
                            </Animated.View>

                            {/* misc */}
                            <Animated.View entering={FadeInDown.delay(100).duration(700).springify().damping(12)} className="flex-row justify-around">
                                <View className="flex rounded-full bg-amber-300 p-2">
                                    <View
                                        style={{ height: hp(6.5), width: hp(6.5) }}
                                        className="bg-white rounded-full flex items-center justify-center"
                                    >
                                        <ClockIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
                                    </View>
                                    <View className="flex items-center py-2 space-y-1">
                                        <Text style={{ fontSize: hp(2) }} className="font-bold text-neutral-700">
                                            {meal?.strTime}
                                        </Text>
                                        <Text style={{ fontSize: hp(1.5) }} className="font-bold text-neutral-700">
                                            Phút
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex rounded-full bg-amber-300 p-2">
                                    <View
                                        style={{ height: hp(6.5), width: hp(6.5) }}
                                        className="bg-white rounded-full flex items-center justify-center"
                                    >
                                        <UsersIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
                                    </View>
                                    <View className="flex items-center py-2 space-y-1">
                                        <Text style={{ fontSize: hp(2) }} className="font-bold text-neutral-700">
                                            {meal?.strServing}
                                        </Text>
                                        <Text style={{ fontSize: hp(1.5) }} className="font-bold text-neutral-700">
                                            Người
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex rounded-full bg-amber-300 p-2">
                                    <View
                                        style={{ height: hp(6.5), width: hp(6.5) }}
                                        className="bg-white rounded-full flex items-center justify-center"
                                    >
                                        <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
                                    </View>
                                    <View className="flex items-center py-2 space-y-1 mt-3">
                                        <Text style={{ fontSize: hp(1.5) }} className="font-bold text-neutral-700">
                                            {meal?.strType}
                                        </Text>
                                    </View>
                                </View>
                            </Animated.View>

                            {/* ingredients */}
                            <Animated.View entering={FadeInDown.delay(200).duration(700).springify().damping(12)} className="space-y-4">
                                <Text style={{ fontSize: hp(2.5) }} className="font-bold flex-1 text-neutral-700">
                                    Ingredients
                                </Text>
                                <View className="space-y-2 ml-3">
                                    {
                                        ingredientsIndexes(meal).map(i => {
                                            return (
                                                <View key={i} className="flex-row space-x-4">
                                                    <View style={{ height: hp(1.5), width: hp(1.5) }}
                                                        className="bg-amber-300 rounded-full" />
                                                    <View className="flex-row space-x-2">
                                                        <Text style={{ fontSize: hp(1.7) }} className="font-extrabold text-neutral-700">{meal['strMeasure' + i]}</Text>
                                                        <Text style={{ fontSize: hp(1.7) }} className="font-medium text-neutral-600">{meal['strIngredient' + i]}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </Animated.View>
                            {/* instructions */}
                            <Animated.View entering={FadeInDown.delay(300).duration(700).springify().damping(12)} className="space-y-4">
                                <Text style={{ fontSize: hp(2.5) }} className="font-bold flex-1 text-neutral-700">
                                    Instructions
                                </Text>
                                <Text style={{ fontSize: hp(1.6) }} className="text-neutral-700">
                                    {
                                        meal?.strInstructions
                                    }
                                </Text>
                            </Animated.View>
                        </View>
                    )
                }
            </ScrollView>
        </View>

    )
}