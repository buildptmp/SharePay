import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
export default function Profilepage({page}){
    return(
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
            <Text 
                onPress={()=> alert('This is "profile Page"')}
                style={{ fontSize: 26, fontWeight:'bold'}}> 
                Profile Page
            </Text>

        </View>
    );
}

