import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, SectionList, StyleSheet, SafeAreaView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Styles } from "../Styles"
import { getGroupListByUid } from "../../database/DBConnection";
import { ListItem } from "react-native-elements";

export default function Notification({page, navigation}){
    return(
        <Text> This is Notification</Text>
    );
}