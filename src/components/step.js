import React from "react";
import { View, Text, Flatlist, Image, useWindowDimensions, ScrollView } from 'react-native';
import { CachedImage } from "../helpers/image";

export default Step = ({ item }) =>{
    
    const { width } = useWindowDimensions();

    return (
        <View style={[{flex: 1, justifyContent: 'center', alignItems: 'center'}, { width }]}>
            <CachedImage uri={item.image1} style={[{flex: 0.6, justifyContent: 'center'}, { width }]} />
            <ScrollView style={{flex: 0.4}}>
                <Text style={{fontWeight: 800, fontSize: 28, marginBottom: 16, textAlign: 'center'}}>{item.strHeader}</Text>
                <Text style={{fontWeight: 300, fontSize: 17, paddingHorizontal: 55, textAlign: 'center'}}>{item.strDescribe}</Text>
            </ScrollView>
        </View>
    );
};
