import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, FlatList, Animated } from 'react-native';
import Step from '../components/step';
import Paginator from '../components/Paginator';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

export default function StepScreen({ route }) {
  const { slidesData } = route.params;
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={{ flex: 1 , backgroundColor: 'white' }}>
      <View style={{ paddingVertical: hp(2) }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: hp(2), backgroundColor: 'white' }}>
          <ChevronLeftIcon size={hp(4)} strokeWidth={3.5} color="#fbbf24" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 3 , backgroundColor: 'white' }}>
        <FlatList
          data={slidesData}
          renderItem={({ item }) => <Step item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.idStep}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>
      <View style={{ alignItems: 'center', backgroundColor: 'white' }}>
        <Paginator data={slidesData} scrollX={scrollX} />
      </View>
    </View>
  );
}
