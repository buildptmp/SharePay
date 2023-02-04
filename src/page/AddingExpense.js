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
//  import CheckBox from 'react-native-check-box';
 import SectionList from 'react-native/Libraries/Lists/SectionList';
 import SelectDropdown from 'react-native-select-dropdown'


 export default function AddingExpense({ navigation }) {
    const [ItemName, setItemName] = useState(null);
    const [ItemPrice, setItemPrice] = useState(null);
    const [Creditor, setCreditor] = useState(null);
    const RouteMapping = [
        { routeName: 'AddingMember', displayText: 'Add Member', }
    ]
    // const [isChecked, setIscheck] = useState({
    //     Build: false,
    //     Prai: false,
    //     Pop: false,
    // });
    const Member = ["Buildkin", "Prai", "Pop"]
    return(
        
        <View style={Styles.container}>
        
       
            <View style={[{ width: '100%', paddingHorizontal: 100, flex: 3, backgroundColor: '#F6EFEF'}]}>
                <Text style={Styles.textboxtop}>Item Name</Text>
                <TextInput
                style={Styles.input}
                value={ItemName}
                placeholder={"Insert item"}
                onChangeText={(text) => setItemName(text)}
                autoCapitalize={"none"}
                />
                <Text style={Styles.textboxtop}>Price</Text>
                <TextInput
                style={Styles.input}
                value={ItemPrice}
                placeholder={"Insert Price"}
                onChangeText={(text) => setItemPrice(text)}
                autoCapitalize={"none"}
                />
                <Text style={Styles.textboxtop}>Creditor</Text>
                <SelectDropdown
                    defaultValue={Creditor}
                    data={Member}
                    onSelect={(selectedItem) => {
                        setCreditor(selectedItem)
                    }}
                    buttonTextAfterSelection={(selectedItem) => {
                        return selectedItem
                    }}
                    rowTextForSelection={(Member) => {
                        return Member
                    }}
                    buttonStyle={Styles.dropDownCredBtnStyle}
                />
                <Text style={Styles.textboxtop}>Debtor</Text>
                <Text>Select the member who share this expense</Text>
                {/* <CheckBox 
                isChecked={isChecked.Build} 
                onClick={()=> setIscheck(!isChecked)}
                rightText="Build"
                checkedCheckBoxColor='green'
                //uncheckedCheckBoxColor='red'
                /> */}
                

                <TouchableOpacity 
                                // key={e.routeName}
                                style={Styles.btn}
                                onPress={() => navigation.navigate('')}
                            >
                                <Text style={Styles.text}> Add Expense</Text>
                            </TouchableOpacity>
            </View>
        </View> 
    );
};

