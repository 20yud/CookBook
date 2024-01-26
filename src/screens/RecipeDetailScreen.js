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
import { ref, onValue, set, remove, get } from 'firebase/database';
import slides from "../../slides";

const ios = Platform.OS == 'ios';



export default function RecipeDetailScreen(props) {
    let item = props.route.params;
    const [isFavourite, setIsFavourite] = useState(null);
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
        if (user) {
            checkFavorites(item, user.uid);
        }
    }, [user])
    useEffect(() => {
        getMealData(item);
    }, [])
    const addFavorite = async (item, uid) => {
        try {
            if (user !== null) {
                const usersRef = ref(db, 'users');
                get(usersRef).then(snapshot => {
                    const usersData = snapshot.val();
                    // Kiểm tra nếu dữ liệu không tồn tại hoặc không phải là một mảng
                    if (usersData && Array.isArray(usersData)) {
                        const userIndex = usersData.findIndex(user => user && user.userID === uid);
                        if (userIndex !== -1 && usersData[userIndex].favorites) {
                            const favoriteData = usersData[userIndex].favorites;
                            //insert dữ liệu favorite mới
                            for (let i = 0; i <= favoriteData.length; i++) {
                                if (favoriteData[i] == undefined || favoriteData[i] == null) {
                                    set(ref(db, 'users/' + userIndex + '/favorites/' + i), {
                                        idMeal: parseInt(item.idMeal),
                                        strCategory: item.strCategory
                                    })
                                    console.log('add done')
                                    break;
                                }
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
            }
        } catch (err) {
            console.error('Error: ', err.message);
        }
    }

    const removeFavorite = async (item, uid) => {
        try {
            if (user !== null) {
                const usersRef = ref(db, 'users');
                get(usersRef).then(snapshot => {
                    const usersData = snapshot.val();
                    // Kiểm tra nếu dữ liệu không tồn tại hoặc không phải là một mảng
                    if (usersData && Array.isArray(usersData)) {
                        const userIndex = usersData.findIndex(user => user && user.userID === uid);

                        if (userIndex !== -1 && usersData[userIndex].favorites) {
                            const favoriteData = usersData[userIndex].favorites;
                            const favoriteIndex = favoriteData.findIndex(data => data && data.idMeal == item.idMeal && data.strCategory == item.strCategory);
                            //remove
                            try {
                                remove(ref(db, 'users/' + userIndex + '/favorites/' + favoriteIndex))
                                console.log('remove done');
                            } catch {
                                console.log('remove error');
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
            }
        } catch (err) {
            console.error('Error: ', err.message);
        }
    }

    const checkFavorites = async (item, uid) => {
        try {
            if (user !== null) {
                const usersRef = ref(db, 'users');
                onValue(usersRef, (snapshot) => {
                    const usersData = snapshot.val();
                    // Kiểm tra nếu dữ liệu không tồn tại hoặc không phải là một mảng
                    if (usersData && Array.isArray(usersData)) {
                        const userIndex = usersData.findIndex(user => user && user.userID === uid);
                        if (userIndex !== -1 && usersData[userIndex].favorites) {
                            const favoriteData = usersData[userIndex].favorites;
                            const meal = {
                                idMeal: parseInt(item.idMeal),
                                strCategory: item.strCategory
                            }
                            for (let i = 0; i < favoriteData.length; i++) {
                                if (favoriteData[i] == undefined || favoriteData[i] == null) { continue }
                                else if (favoriteData[i].idMeal == meal.idMeal && favoriteData[i].strCategory == meal.strCategory) {
                                    return setIsFavourite(true);
                                }
                            }
                            return setIsFavourite(false);
                        } else {
                            console.log('User not found or has no favorite data.');
                            return null;
                        }
                    } else {
                        console.log('Invalid users data structure.');
                        return null;
                    }
                })
            }
        } catch (err) {
            console.error('Error: ', err.message);
        }
    }

    const getMealData = async (item) => {
        try {
            // Transform the mealData to match your expected structure
            const transformedMeal = {
                idMeal: item.idMeal,
                strArea: item.strArea,
                strCategory: item.strCategory,
                // Add other properties you need
                strServing: item.strServing,
                strInstructions: item.strInstructions,
                strMeal: item.strMeal,
                strMealThumb: item.strMealThumb,
                strIngredient1: item.strIngredient1,
                strIngredient2: item.strIngredient2,
                strIngredient3: item.strIngredient3,
                strIngredient4: item.strIngredient4,
                strIngredient5: item.strIngredient5,
                strIngredient6: item.strIngredient6,
                strIngredient7: item.strIngredient7,
                strIngredient8: item.strIngredient8,
                strIngredient9: item.strIngredient9,
                strIngredient10: item.strIngredient10,
                strIngredient11: item.strIngredient11,
                strIngredient12: item.strIngredient12,
                strIngredient13: item.strIngredient13,
                strIngredient14: item.strIngredient14,
                strIngredient15: item.strIngredient15,
                strIngredient16: item.strIngredient16,
                strIngredient17: item.strIngredient17,
                strIngredient18: item.strIngredient18,
                strIngredient19: item.strIngredient19,
                strIngredient20: item.strIngredient20,
                strMeasure1: item.strMeasure1,
                strMeasure2: item.strMeasure2,
                strMeasure3: item.strMeasure3,
                strMeasure4: item.strMeasure4,
                strMeasure5: item.strMeasure5,
                strMeasure6: item.strMeasure6,
                strMeasure7: item.strMeasure7,
                strMeasure8: item.strMeasure8,
                strMeasure9: item.strMeasure9,
                strMeasure10: item.strMeasure10,
                strMeasure11: item.strMeasure11,
                strMeasure12: item.strMeasure12,
                strMeasure13: item.strMeasure13,
                strMeasure14: item.strMeasure14,
                strMeasure15: item.strMeasure15,
                strMeasure16: item.strMeasure16,
                strMeasure17: item.strMeasure17,
                strMeasure18: item.strMeasure18,
                strMeasure19: item.strMeasure19,
                strMeasure20: item.strMeasure20,
                strSource: item.strSource,
                strSteps: item.strSteps,
                strTime: item.strTime,
                strType: item.strType,
                // Add other properties you need
            };
            // Assume setMeal is a function to update the React state
            setMeal(transformedMeal);
            setLoading(false);

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
                    {user !== null ? (
                        <TouchableOpacity className="p-2 rounded-full mr-5 bg-white">
                            <HeartIcon onPress={() => isFavourite ? removeFavorite(item, user.uid) : addFavorite(item, user.uid)} size={hp(3.5)} strokeWidth={4.5} color={isFavourite ? "red" : "gray"} />
                        </TouchableOpacity>
                    ) : null}
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
                            {/* intostep */}
                            <Animated.View entering={FadeInDown.delay(300).duration(700).springify().damping(12)} className="space-y-4">
                                <TouchableOpacity className="py-3 bg-yellow-400 rounded-xl" onPress={() => navigation.navigate('Step', { slidesData: slides })}>
                                    <Text className="text-xl font-bold text-center text-gray-700">Bắt đầu nấu ngay</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    )
                }
            </ScrollView>
        </View>

    )
}