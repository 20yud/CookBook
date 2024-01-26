import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config";
import { db } from "../../config";
import { ref, set, get } from 'firebase/database';

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSignUp = () => {
    if (!name || !email || !password) {
      Alert.alert('Thông báo', 'Hãy nhập đầy đủ thông tin', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
      return;
    }
  
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
  
        const uRef = ref(db, 'users');
        get(uRef).then(snapshot => {
          const data = snapshot.val();
          const nodeCount = Object.values(data).length;
          if (nodeCount) {
            const userRef = ref(db, `users/${nodeCount}`);
            const userData = {
              userId: user.uid,
              userName: name,
            };
            set(userRef, userData);
            console.log('Registered with:', user.email);
          } else {
            console.log("Sai");
          }
        }).catch(error => console.error('Error getting data:', error.message));
      })
      .catch(error => alert("Đăng kí thất bại"))
  }
  
  
  return (
    <View className="flex-1 bg-white" style={{backgroundColor: '#525252'}}>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
            <TouchableOpacity 
                onPress={()=> navigation.goBack()}
                className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
            >
                <ArrowLeftIcon size="20" color="black" />
            </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
            <Image source={require('../../assets/images/signup.png')} 
                style={{width: 165, height: 110}} />
        </View>
      </SafeAreaView>
      <View className="flex-1 bg-white px-8 pt-8"
        style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}
      >
        <View className="form space-y-2">
            <Text className="text-gray-700 ml-4">Họ và tên</Text>
            <TextInput
                value={name}
                onChangeText = {text => setName(text)}
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder='Nhập vào họ tên đầy đủ'
            />
            <Text className="text-gray-700 ml-4">Email</Text>
            <TextInput
                value={email}
                onChangeText = {text => setEmail(text)}
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder='Nhập vào email'
            />
            <Text className="text-gray-700 ml-4">Mật khẩu</Text>
            <TextInput
                value={password}
                onChangeText = {text => setPassword(text)}
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7"
                secureTextEntry
                placeholder='Nhập vào mật khẩu'
            />
            <TouchableOpacity
                className="py-3 bg-yellow-400 rounded-xl"
                onPress={handleSignUp}
            >
                <Text className="font-xl font-bold text-center text-gray-700">
                    Đăng kí
                </Text>
            </TouchableOpacity>
        </View>
        <Text className="text-gray-700 text-center py-5">
           ----- Lựa chọn khác -----
        </Text>
        <View className="flex-row justify-center space-x-12">
            <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
                <Image source={require('../../assets/icons/google.png')} 
                    className="w-10 h-10" />
            </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-7">
            <Text className="text-gray-500 font-semibold">Bạn đã có tài khoản?</Text>
            <TouchableOpacity onPress={()=> navigation.navigate('Login')}>
                <Text className="font-semibold text-yellow-500"> Đăng nhập</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}