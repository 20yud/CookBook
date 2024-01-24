import AccountNavigation from '../navigation/index2';
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ChevronLeftIcon, ArrowRightOnRectangleIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { CachedImage } from '../helpers/image';

export default function MyDiskScreen() {
    const navigation = useNavigation();
    const [Ten, setTen] = useState("");
    const [MoTa, setMoTa] = useState("");
    const [KP, setKP] = useState("");
    const [TGN, setTGN] = useState("");
    const [ingredients, setIngredients] = useState(['']);
    const [steps, setSteps] = useState([{ text: '', image: '' }]);

    const handleX = (index) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1);
        setIngredients(updatedIngredients);
    };
    
    const handleNL = () => {
        setIngredients([...ingredients, '']);
    };

    const handleXCL = (index) => {
        const updatedSteps = [...steps];
        updatedSteps.splice(index, 1);
        setSteps(updatedSteps);
    };
    
    const handleCL = () => {
        setSteps([...steps, { text: '', image: '' }]);
    };

    return(
        <View style={{ flex: 1 , backgroundColor: 'white' }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 50}}
          >
            <View style={{ paddingVertical: hp(1) , flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginTop:hp(2)}}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: hp(3), backgroundColor: 'white' }}>
                    <ChevronLeftIcon size={hp(4)} strokeWidth={3.5} color="#fbbf24" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{justifyContent: 'center' , alignItems: 'center', marginRight: wp(5), height: hp(5),width: wp(30), backgroundColor: '#fbbf24', borderRadius: 10}}>
                    <Text style={{fontWeight: 800 ,fontSize:18, color: 'white'}}>Lên Sóng</Text>
                </TouchableOpacity>
            </View>
            <View style={{backgroundColor: 'gainsboro',paddingVertical: hp(2)}}>
                <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        source={require('../../assets/images/food.png')} 
                        resizeMode="contain" 
                        style={{width: wp(50), height: hp(20),borderBottomLeftRadius: 40, borderBottomRightRadius: 40}}
                    />
                    <Text style={{fontWeight: 800 ,fontSize:15, color: 'gray'}}>Đăng hình đại diện món ăn</Text>
                </TouchableOpacity>
            </View >
            <View style={{ paddingVertical: hp(2), marginLeft: wp(3), marginRight: wp(3)}}>
                <TextInput
                    value = {Ten}
                    onChangeText = {text => setTen(text)}
                    className="p-3 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                    placeholder="Nhập vào tên món ăn"
                />
                <TextInput
                    value = {MoTa}
                    onChangeText = {text => setMoTa(text)}
                    className="pt-3 pb-12 pl-3 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                    placeholder="Nhập vào mô tả"
                />
                <View style={{paddingVertical: hp(0.5) ,  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{fontWeight: 500 ,fontSize:18, color: 'gray', marginLeft: wp(3)}}>Khẩu phần</Text>
                    <TextInput
                        value = {KP}
                        onChangeText = {text => setKP(text)}
                        className="p-3 bg-gray-100 text-gray-700 rounded-2xl"
                        style={{width: wp(50)}}
                        placeholder="Nhập vào số người"
                    />
                </View>
                <View style={{paddingVertical: hp(0.5) ,  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{fontWeight: 500 ,fontSize:18, color: 'gray', marginLeft: wp(3)}}>Thời gian nấu</Text>
                    <TextInput
                        value = {TGN}
                        onChangeText = {text => setTGN(text)}
                        className="p-3 bg-gray-100 text-gray-700 rounded-2xl"
                        style={{width: wp(50)}}
                        placeholder="Nhập vào thời gian nấu"
                    />
                </View>
            </View>
            <View style={{paddingVertical: hp(1)}}>
                <Text style={{fontWeight: 800 ,fontSize:23, color: 'black', marginLeft: wp(5)}}>Khẩu phần</Text>
                {ingredients.map((ingredient, index) => (
                    <View key={index} style={{ paddingVertical:  hp(1), flexDirection: 'row', justifyContent: "space-between", alignItems: 'center'}}>
                        <TextInput
                            style={{ width: wp(70), marginLeft: wp(5), padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 }}
                            placeholder="Nhập vào nguyên liệu"
                            value={ingredient}
                            onChangeText={(text) => {
                            const updatedIngredients = [...ingredients];
                            updatedIngredients[index] = text;
                            setIngredients(updatedIngredients);
                            }}
                        />
                        <TouchableOpacity onPress={() => handleX(index)} style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20, height: hp(6), width: wp(15), backgroundColor: '#fbbf24', borderRadius: 10 }}>
                            <Text style={{ fontWeight: 800, fontSize: 18, color: 'white' }}>Xóa</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity onPress={handleNL} style={{justifyContent: 'center' , alignItems: 'center', height: hp(6),width: wp(30), backgroundColor: 'white', borderRadius: 10, marginLeft: wp(30)}}>
                        <Text style={{fontWeight: 800 ,fontSize:18, color: 'black'}}>+  Nguyên liệu</Text>
                </TouchableOpacity>
            </View>
            <View style={{paddingVertical: hp(1)}}>
                <Text style={{fontWeight: 800 ,fontSize:23, color: 'black', marginLeft: wp(5)}}>Cách làm</Text>
                {steps.map((step, index) => (
                    <View key={index} style={{ paddingVertical:  hp(1), flexDirection: 'row', justifyContent: "space-between", alignItems: 'center'}}>
                        <View key={index} > 
                            <TextInput
                                style={{ width: wp(70), marginLeft: wp(5), padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 }}
                                placeholder="Nhập vào cách làm"
                                value={step}
                                onChangeText={(text) => {
                                const updatedSteps = [...steps];
                                updatedSteps[index] = text;
                                setIngredients(updatedSteps);
                                }}
                            />
                        </View>
                        <TouchableOpacity onPress={() => handleXCL(index)} style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20, height: hp(6), width: wp(15), backgroundColor: '#fbbf24', borderRadius: 10 }}>
                            <Text style={{ fontWeight: 800, fontSize: 18, color: 'white' }}>Xóa</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity onPress={handleCL} style={{justifyContent: 'center' , alignItems: 'center', height: hp(6),width: wp(30), backgroundColor: 'white', borderRadius: 10, marginLeft: wp(30)}}>
                        <Text style={{fontWeight: 800 ,fontSize:18, color: 'black'}}>+  Bước</Text>
                </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
    )
}