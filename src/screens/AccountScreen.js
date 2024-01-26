import AccountNavigation from '../navigation/index2';
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon, ArrowRightOnRectangleIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../../config";
import { db } from '../../config';
import { ref, onValue } from 'firebase/database';

export default function AccountScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      // authUser sẽ là null nếu không có ai đăng nhập
      setUser(authUser);
    });
    if (user) { getName(user.uid) }
    // Hủy đăng ký sự kiện khi component bị hủy
    return () => unsubscribe();
  }, [user]);

  const handleLogOutPress = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Home');
      console.log('LogOut with:', user.email);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getName = async (uid) => {
    try {
      const usersRef = ref(db, 'users');
      onValue(usersRef, (snapshot) => {
        const usersData = snapshot.val();
        // Kiểm tra nếu dữ liệu không tồn tại hoặc không phải là một mảng
        if (usersData && Array.isArray(usersData)) {
          const userIndex = usersData.findIndex(user => user && user.userID === uid);
          if (userIndex !== -1 && usersData[userIndex].userName) {
            setName(usersData[userIndex].userName)
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

  return (
    <View className="flex-1 bg-white space-y-6 pt-14">
      <View className="mx-4 flex-row justify-between items-center mb-2">
        <View className="flex-row">
          <TouchableOpacity onPress={() => navigation.goBack()} className="rounded-full bg-white">
            <ChevronLeftIcon size={hp(4)} strokeWidth={4} color="#fbbf24" />
          </TouchableOpacity>
          <Image source={require('../../assets/images/avatar.png')} style={{ height: hp(5), width: hp(5.5), marginRight: 7, marginLeft: 12 }} />
          <View>
            <Text style={{ fontSize: hp(2) }} className="text-neutral-600">
              {name}
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