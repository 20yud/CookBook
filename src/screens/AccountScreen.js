import AccountNavigation from '../navigation/index2';
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ChevronLeftIcon, ArrowRightOnRectangleIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../../config";

export default function AccountScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      // authUser sẽ là null nếu không có ai đăng nhập
      setUser(authUser);
    });

    // Hủy đăng ký sự kiện khi component bị hủy
    return () => unsubscribe();
  }, []);

  const handleLogOutPress = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home');
      console.log('LogOut with:', user.email);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View className="flex-1 bg-white space-y-6 pt-14">
      <View className="mx-4 flex-row justify-between items-center mb-2">
        <View className="flex-row">
          <TouchableOpacity onPress={()=> navigation.goBack()} className="rounded-full bg-white">
            <ChevronLeftIcon size={hp(4)} strokeWidth={4} color="#fbbf24" />
          </TouchableOpacity>
          <Image source={require('../../assets/images/avatar.png')} style={{height: hp(5), width: hp(5.5), marginRight: 7, marginLeft: 12}} />
          <View> 
            <Text style={{ fontSize: hp(2) }} className="text-neutral-600">
              Hieu Nguyen
            </Text>
            {user && (
              <Text style={{ fontSize: hp(1.6), color: 'gray' }} className="text-neutral-600">
                {user.email}
              </Text>
            )}
          </View> 
        </View>
        <TouchableOpacity onPress={handleLogOutPress} className="rounded-full mr-2 bg-white">
          <ArrowRightOnRectangleIcon size={hp(4)} strokeWidth={2} color="#fbbf24" />
        </TouchableOpacity>
      </View>
      <AccountNavigation />
    </View>
  );
}