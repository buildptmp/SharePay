import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Styles } from "../Styles"

export default function Debtlist({page, navigation}){
   const
    return(
        <DebtView
        values={['Debt list', 'Debtor list']}
        selectedValue={}
        >

        </DebtView>
    );
};

const DebtView = ({
    values,
    selectedValue,
    setSelectedValue,
}) => (
    <View>
    <View style={Styles.containerdlist}>
        {values.map(value => (
            <TouchableOpacity
            key={value}
            onPress={() => setSelectedValue(value)}
            style={[Styles.btnlist, selectedValue === value && Styles.selected]}>
                <Text
                style={[
                Styles.text,
                selectedValue === value && Styles.selectedLabel,
                ]}>
                {value}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
        <View style={[styles.container, {[label]: selectedValue}]}>{children}</View> 
    </View>
);

