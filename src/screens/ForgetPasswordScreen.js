import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import { auth } from "../../config";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useEffect, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgetPasswordScreen() {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("Home")
      }
    })
    return unsubscribe
  }, [])

  const handleXN = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        arlert("Đổi mật khẩu thành công")
      })
      .catch(error => alert(error.message))
  }

  const signInWithGoogle = async () => {

  };

  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: '#525252' }}>
      <SafeAreaView className="flex ">
        <View className="flex-row justify-start">
          <TouchableOpacity onPress={() => navigation.goBack()}
            className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
          <Image source={require('../../assets/images/Fogot.png')}
            style={{ width: 300, height: 300 }} />
        </View>
      </SafeAreaView>
      <View
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        className="flex-1 bg-white px-8 pt-8">
        <View className="form space-y-2" >
          <Text className="text-gray-700 ml-4">Tài khoản</Text>
          <TextInput
            value={email}
            onChangeText={text => setEmail(text)}
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            placeholder="Nhập vào email"
          />
          <TouchableOpacity className="py-3 bg-yellow-400 rounded-xl" onPress={handleXN}>
            <Text className="text-xl font-bold text-center text-gray-700">Xác nhận</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-700 text-center py-5">----- Lựa chọn khác -----</Text>
        <View className="flex-row justify-center space-x-12">
          <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl" onPress={signInWithGoogle}>
            <Image source={require('../../assets/icons/google.png')} className="w-10 h-10" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-7">
          <Text className="text-gray-500 font-semibold">
            Bạn chưa có tài khoản?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text className="font-semibold text-yellow-500"> Đăng kí</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>

  )
}