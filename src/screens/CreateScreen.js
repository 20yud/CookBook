import AccountNavigation from '../navigation/index2';
import React, { useRef, useState, useEffect } from 'react'
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, ViewBase, Alert } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ChevronLeftIcon, ArrowRightOnRectangleIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../../config";
import { db } from '../../config';
import { getDatabase, ref as r, push, set, get } from 'firebase/database';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Dropdown } from 'react-native-element-dropdown';


export default function MyDiskScreen() {
    const navigation = useNavigation();
    const [HDD, SetHDD] = useState(""); //Hinh dai dien
    const [Ten, setTen] = useState(""); //Ten mon an
    const [MoTa, setMoTa] = useState(""); //Mota
    const [KP, setKP] = useState("");//Khau phan
    const [TGN, setTGN] = useState("");//Thoi gian nau
    const [DK, SetDK] = useState('Easy');//Do kho
    const [ingredients, setIngredients] = useState([{ text: '', soluong: '' }]);// Thanh phan , so luong
    const [steps, setSteps] = useState([{ text: '', image: '' }]);  //step va hinh anh
    const [TL, setValue] = useState("");//The loai
    const [isFocus, setIsFocus] = useState(false);  
    const [countlenght, setCL] = useState(null);
    const [user, setUser] = useState("");
    const [name, setName] = useState("");


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
          // authUser sẽ là null nếu không có ai đăng nhập
          setUser(authUser);
          
        });
    
        // Hủy đăng ký sự kiện khi component bị hủy
        return () => unsubscribe();  m
      }, []);

      useEffect(() => {
        if(user){
          getUserData();
        }
        
      }, [user]);
      useEffect(() => {
        if(user){
          getMealsCount();
        }
      }, [TL]);
      useEffect(() => {
        if(user){
          console.log('Mon an1',countlenght);
        }
      }, [countlenght]);
      const getMealsCount = async () => {
        
        try {
          const dbRef = r(getDatabase(), `data/${TL}/meals`);
          const snapshot = await get(dbRef);
      
          if (snapshot.exists()) {
            const mealsData = snapshot.val();
            const mealsArray = Object.values(mealsData);
      
            if (mealsArray && Array.isArray(mealsArray)) {
              const mealsCount = mealsArray.length;
              setCL(mealsCount)
            } else {
              console.warn("Invalid 'meals' data structure");
            }
          } else {
            console.warn("No data found at the specified path");
          }
        } catch (error) {
          console.error("Error retrieving meals data:", error);
        }
      };


      const uploadImageToFirebase = async (uri, storagePath) => {
        const storage = getStorage();
        const storageRef = ref(storage, storagePath);
      
        try {
          const xhr = new XMLHttpRequest();
          xhr.onload = async function () {
            if (xhr.status === 200) {
              const downloadURL = xhr.response;
      
              console.log("File uploaded successfully. Download URL:", downloadURL);
      
              return downloadURL;
            } else {
              
            }
          };
          xhr.onerror = function () {
            console.error("Error uploading file:", xhr.status);
          };
          xhr.open("GET", uri);
          xhr.responseType = "blob";
          xhr.send();
      
          const blob = await new Promise((resolve, reject) => {
            xhr.onloadend = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function () {
              reject(new TypeError("Network request failed"));
            };
          });
      
          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
      
          console.log("File uploaded successfully. Download URL:", downloadURL);
      
          return downloadURL;
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      };

      const getUserData = async () => {
        try {
            const dbRef = r(getDatabase(), 'users/');
            const snapshot = await get(dbRef);
      
          if (snapshot.exists()) {
            const usersData = snapshot.val();
            const usersArray = Object.values(usersData);
      
            // Assuming user is not null and has a uid
            const targetUserID = user.uid;
            
            const targetUser = usersArray.find(userData => {
              const lowerCaseUserID = userData?.userID ? userData.userID : '';
              const lowerCaseUserId = userData?.userId ? userData.userId : '';
              return lowerCaseUserID === targetUserID || lowerCaseUserId === targetUserID;
            });
            
            if (targetUser) {
              const targetUserName = targetUser?.userName;
              setName(targetUserName);
            } else {
              console.warn(`User with userID ${targetUserID} not found`);
            }
          } else {
            console.warn("No data found at the specified path");
          }
        } catch (error) {
          console.error("Error retrieving user data:", error);
        }
      };

    //   const handleImageUpload = async () => {
    //     if (HDD) {
    //         const storagePath = 'data/test/' + user.uid; // Định danh duy nhất cho file ảnh
    //         const downloadURL = await uploadImageToFirebase(HDD, storagePath);
    //         // Ở đây, bạn có thể sử dụng downloadURL cho mục đích của mình.
    //     } else {
    //         console.warn("No image selected for upload.");
    //     }
    // };
    const addRecipeToFirebase = async () => {
        try {
            // Step 1: Upload image and get download URL
            const storagePath = `data/${TL}/image/${user.uid}`;
            const imageURL = await uploadImageToFirebase(HDD, storagePath);
    
            // Step 2: Prepare recipe data
            const recipeData = {
                strMealThumb: imageURL,
                strMeal: Ten,
                strInstructions: MoTa,
                idMeal: countlenght + 1, // You need to generate a unique ID, you can use a timestamp for simplicity
                strServing: KP,
                strTime: TGN,
                strType: DK,
                strArea: name,
                strCategory: TL,
                strSource: "",
                struserID: user.uid,
            };
    
            // Step 3: Add ingredients to recipe data
            ingredients.forEach((ingredient, index) => {
                recipeData[`strIngredient${index + 1}`] = ingredient.text;
                recipeData[`strMeasure${index + 1}`] = ingredient.soluong;
            });
    
            const recipeSteps = [];
            await Promise.all(steps.map(async (step, index) => {
                const stepStoragePath = `data/${TL}/steps/${user.uid}/image${index + 1}`;
                const stepImageURL = await uploadImageToFirebase(step.image, stepStoragePath);
                const stepData = {
                    idStep: index + 1,
                    image1: stepImageURL,
                    strDescribe: step.text,
                    strHeader: `Bước ${index + 1}`,
                };
                recipeSteps.push(stepData);
            }));
    
            // Add the steps array to recipe data
            recipeData.steps = recipeSteps;
    
            const dbRef = r(getDatabase(), `data/${TL}/meals/${countlenght}`);
            await set(dbRef, recipeData); // Set the recipe data with the key as countlenght
    
            // Now, add the steps data to a separate location
            const stepsDbRef = r(getDatabase(), `data/${TL}/meals/${countlenght}/strSteps`);
            await set(stepsDbRef, recipeSteps);
    
            Alert.alert('Thêm Công Thức Mới Thành Công.');
        } catch (error) {
            Alert.alert('Thêm Công Thức Mới Không Thành Công');
        }
    };
    
    const pickImage2 = async () => {
        let result = {};
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        })
        if (!result.canceled) {
            SetHDD(result.assets[0].uri);
        }
    };

   
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
    const pickImage = async (index) => {
        let result = {};
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        })
        if (!result.canceled) {
            const updatedSteps = [...steps];
            updatedSteps[index] = { ...steps[index], image: result.assets[0].uri };
            setSteps(updatedSteps);
        }
    };
    const handleDK = (index) => {
        SetDK(index);
    };

    const data = [
        { label: 'Món ăn sáng', value: 'monAnSang' },
        { label: 'Món chiên', value: 'monChien' },
        { label: 'Món Gỏi', value: 'monGoi' },
        { label: 'Món Kho', value: 'monKho' },
        { label: 'Món Tráng Miệng', value: 'monTrangMieng' },
        { label: 'Món Xào', value: 'monXao' },
      ];
    
     
        
    
      const renderLabel = () => {
        if (TL || isFocus) {
          return (
            <Text
              style={{
                position: 'absolute',
                backgroundColor: 'white',
                left: 22,
                top: 8,
                zIndex: 999,
                paddingHorizontal: 8,
                fontSize: 14,
                color: isFocus ? 'blue' : 'black',
              }}
            >
            </Text>
          );
        }
        return null;
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
                <TouchableOpacity onPress={() => {
                            navigation.goBack();
                            //handleImageUpload();
                            addRecipeToFirebase();
                        }} style={{justifyContent: 'center' , alignItems: 'center', marginRight: wp(5), height: hp(5),width: wp(30), backgroundColor: '#fbbf24', borderRadius: 10}}>
                            <Text style={{fontWeight: 800 ,fontSize:18, color: 'white'}}>Lên Sóng</Text>
                        </TouchableOpacity>
            </View>
            <View style={{backgroundColor: 'gainsboro',paddingVertical: hp(2)}}>
                <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={() => pickImage2()}>
                    <Image
                        source={HDD ? { uri: HDD } : require('../../assets/images/food.png')}
                        resizeMode="contain" 
                        style={{width: wp(100), height: hp(25)}}
                    />
                    {HDD? <Text/>:<Text style={{fontWeight: 800 ,fontSize:15, color: 'gray'}}>Đăng hình đại diện món ăn</Text>}
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
                <View style={{ backgroundColor: 'white', padding: 16 }}>
                        {renderLabel()}
                        <Dropdown
                        style={{
                            height: 50,
                            borderColor: isFocus ? 'gray' : 'gray',
                            borderWidth: 0.5,
                            borderRadius: 8,
                            paddingHorizontal: 8,
                        }}
                        placeholderStyle={{ fontSize: 16 }}
                        selectedTextStyle={{ fontSize: 16 }}
                        inputSearchStyle={{ height: 40, fontSize: 16 }}
                        iconStyle={{ width: 20, height: 20 }}
                        data={data}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Chọn danh mục' : '...'}
                        searchPlaceholder="Tìm..."
                        value={TL}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={(item) => { 
                            setValue(item.value);
                            setIsFocus(false);
                        }}
            
                        />
                    </View>
                <View style={{paddingVertical: hp(1) ,  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{fontWeight: 500 ,fontSize:18, color: 'gray'}}>Khẩu phần</Text>
                    <TextInput
                        value = {KP}
                        onChangeText = {text => setKP(text)}
                        className="p-3 bg-gray-100 text-gray-700 rounded-2xl"
                        style={{width: wp(60)}}
                        placeholder="Nhập vào số người"
                    />
                </View>
                <View style={{paddingVertical: hp(1) ,  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{fontWeight: 500 ,fontSize:18, color: 'gray'}}>Thời gian nấu</Text>
                    <TextInput
                        value = {TGN}
                        onChangeText = {text => setTGN(text)}
                        className="p-3 bg-gray-100 text-gray-700 rounded-2xl"
                        style={{width: wp(60)}}
                        placeholder="Nhập vào thời gian nấu"
                    />
                </View>
                <View style={{paddingVertical: hp(1),  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{fontWeight: 500 ,fontSize:18, color: 'gray', paddingBottom: hp(1)}}>Chọn độ khó</Text>
                    <TouchableOpacity 
                        onPress={() => handleDK('Easy')} 
                        style={{ justifyContent: 'center', alignItems: 'center',  height: hp(6), width: wp(16), borderRadius: 10 ,
                            backgroundColor: DK === 'Easy' ? '#fbbf24' : 'gray',
                        }}
                    >
                        <Text style={{ fontWeight: 600, fontSize: 15, color: 'white' }}>Easy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => handleDK('Medium')} 
                        style={{ justifyContent: 'center', alignItems: 'center', height: hp(6), width: wp(16), borderRadius: 10 ,
                            backgroundColor: DK === 'Medium' ? '#fbbf24' : 'gray',
                        }}
                    >
                        <Text style={{ fontWeight: 600, fontSize: 15, color: 'white' }}>Medium</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => handleDK('Hard')} 
                        style={{ justifyContent: 'center', alignItems: 'center', height: hp(6), width: wp(16), borderRadius: 10 ,
                            backgroundColor: DK === 'Hard' ? '#fbbf24' : 'gray',
                        }}
                    >
                        <Text style={{ fontWeight: 600, fontSize: 15, color: 'white' }}>Hard</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{paddingVertical: hp(1)}}>
                <Text style={{fontWeight: 800 ,fontSize:23, color: 'black', marginLeft: wp(5)}}>Khẩu phần</Text>
                {ingredients.map((ingredient, index) => (
                    <View key={index} style={{ paddingVertical:  hp(1), flexDirection: 'row', justifyContent: "space-between", alignItems: 'center'}}>
                        <TextInput
                            style={{ width: wp(50), marginLeft: wp(5), padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 }}
                            placeholder="Nhập vào nguyên liệu"
                            value={ingredient.text}
                            onChangeText={(text) => {
                            const updatedIngredients = [...ingredients];
                            updatedIngredients[index] = {...ingredient, text: text};
                            setIngredients(updatedIngredients);
                            }}
                        />
                        <TextInput
                            style={{ width: wp(20), marginLeft: wp(1), padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 }}
                            placeholder="Số lượng"
                            value={ingredient.soluong}
                            onChangeText={(soluong) => {
                                const updatedIngredients = [...ingredients];
                                updatedIngredients[index] = {...ingredient, soluong: soluong};
                                setIngredients(updatedIngredients);
                            }}
                        />
                        
                        <TouchableOpacity onPress={() => handleX(index)} style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20, height: hp(6), width: wp(15), backgroundColor: '#fbbf24', borderRadius: 10 }}>
                            <Text style={{ fontWeight: 800, fontSize: 18, color: 'white' }}>Xóa</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity onPress={handleNL} style={{justifyContent: 'center' , alignItems: 'center', height: hp(6),width: wp(40), backgroundColor: 'white', borderRadius: 10, marginLeft: wp(25)}}>
                        <Text style={{fontWeight: 800 ,fontSize:18, color: 'black'}}>+  Nguyên liệu</Text>
                </TouchableOpacity>
            </View>
            <View style={{paddingVertical: hp(1)}}>
                <Text style={{fontWeight: 800 ,fontSize:23, color: 'black', marginLeft: wp(5)}}>Cách làm</Text>
                {steps.map((step, index) => (
                    <View key={index} style={{ paddingVertical:  hp(1), flexDirection: 'row', justifyContent: "space-between", alignItems: 'center'}}>
                        <View> 
                            <TextInput
                                style={{ width: wp(70), marginLeft: wp(5), padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10 }}
                                placeholder="Nhập vào cách làm"
                                value={step.text}
                                onChangeText={(text) => {
                                    const updatedSteps = [...steps];
                                    updatedSteps[index] = { ...step, text: text };
                                    setSteps(updatedSteps);
                                }}
                            />
                            <TouchableOpacity onPress={() => pickImage(index)}>
                                <Image
                                    source={step.image ? { uri: step.image } : require('../../assets/images/food.png')}
                                    style={{ width: wp(25), height: hp(12), marginLeft: 20 }}
                                />
                            </TouchableOpacity>
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
