import { NavigationContainer, StackActions } from '@react-navigation/native';
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useHistory } from "react-router-dom";
import { createStackNavigator } from '@react-navigation/stack';
import Homepage from './Homepage';
import { Styles } from "../Styles"
import { NavigationScreenProps } from "react-navigation";
import { FC, useEffect, ReactElement, useState } from "react";
import { Button, 
    StyleSheet, 
    Text,
    TextInput , 
    View, 
    FlatList, 
    SafeAreaView, 
    Image,
    TouchableOpacity,
 } from "react-native";

 export default function GroupCreate({ navigation }) {
    const [GroupName, setGroupName] = useState(null);
    const [GroupDesc, setGroupDesc] = useState(null);
    const RouteMapping = [
        { routeName: 'AddingMember', displayText: 'Add Member', }
    ]

    return(
        
        <View style={Styles.container}>
            <View style={[{flex:1}]} />
            <Image 
                style = {Styles.logoImg}
                source={require('../assets/AddMem.png')} 
            />
        
       
            <View style={[{ width: '100%', paddingHorizontal: 100, flex: 3, backgroundColor: '#F6EFEF'}]}>
                <Text style={Styles.textboxtop}>Group Name</Text>
                <TextInput
                style={Styles.input}
                value={GroupName}
                placeholder={"Insert Group Name"}
                onChangeText={(text) => setGroupName(text)}
                autoCapitalize={"none"}
                />
                <Text style={Styles.textboxtop}>Group Description</Text>
                <TextInput
                style={Styles.descinput}
                value={GroupDesc}
                placeholder={"(Optional)"}
                onChangeText={(text) => setGroupDesc(text)}
                autoCapitalize={"none"}
                />
                <TouchableOpacity 
                                // key={e.routeName}
                                style={Styles.btn}
                                onPress={() => navigation.navigate('AddingMember')}
                            >
                                <Text style={Styles.text}> Create Group</Text>
                            </TouchableOpacity>
            </View>
        </View> 
    );
};

