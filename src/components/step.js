import React from "react";
import { View, Text, Flatlist, Image, useWindowDimensions } from 'react-native';

export default Step = ({ item }) =>{
    
    const { width } = useWindowDimensions();

    return (
        <View style={[{flex: 1, justifyContent: 'center', alignItems: 'center'}, { width }]}>
            <Image source={item.image} style={[{flex: 0.6, justifyContent: 'center'}, { width }]} />
            <View style={{flex: 0.4}}>
                <Text style={{fontWeight: 800, fontSize: 28, marginBottom: 16, textAlign: 'center'}}>{item.strHeader}</Text>
                <Text style={{fontWeight: 300, fontSize: 17, paddingHorizontal: 64, textAlign: 'center'}}>{item.strDescribe}</Text>
            </View>
        </View>
    );
};
