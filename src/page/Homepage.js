import * as React from 'react';
import { View, Text } from 'react-native';
export default function Homepage({page}){
    return(
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
            <Text 
                onPress={()=> alert('This is "homepage"')}
                style={{ fontSize: 26, fontWeight:'bold'}}> 
                Home Page
            </Text>

        </View>
    );
}
