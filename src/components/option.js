import { NavigationContainer, StackActions } from '@react-navigation/native';
import * as React from 'react';
import { Styles } from "../Styles"
import { FC, useEffect, ReactElement, useState, useRef } from "react";
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
import Icon from 'react-native-vector-icons/Fontisto';
// import Icon from 'react-native-vector-icons/AntDesign';
import {addExpense, addDebtor, getMemberListByGid} from '../../database/DBConnection';
import SplitE from './opt_splitE';
import UserInputNumber from './opt_userInputNumber'
import PercentageShare from './opt_percentageShare';

export default function Selection() {
    const [option, setOption] = useState("");
    const methods = ["Split Equally", "Input a price myself", "Percentage Share"]
    return(
    <View style={Styles.container}>
        <SelectDropdown
            data={methods}
            defaultButtonText={'Select spliting method'}
            onSelect={(selectedItem) => {
                setOption(selectedItem)
            }} 
            buttonTextAfterSelection={(selectedItem) => {
                return selectedItem
            }}
            rowTextForSelection={(option) => {
                return option
            }} 
            buttonStyle={Styles.dropdownBtnStyle}
            buttonTextStyle={Styles.dropdownBtnTxtStyle}
            renderDropdownIcon={(selectedItem) => {
                return (<Icon name={selectedItem ? 'angle-up':'angle-down'}/>);
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={Styles.dropdownDropdownStyle}
            rowStyle={Styles.dropdownRowStyle}
            rowTextStyle={Styles.dropdownRowTxtStyle}
        />
        { option == "Split Equally" ? <SplitE data={user}/>:null}
        { option == "Input a price myself" ? <UserInputNumber/>:null}
        { option == "Percentage Share" ? <PercentageShare/>:null}
        </View>
    );
};