import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {BellIcon, MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import { StatusBar } from 'expo-status-bar'

export default function MyDiskScreen() {
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
          </ScrollView>
        </View>

    )
}