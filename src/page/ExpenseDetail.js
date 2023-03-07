import React, { useState, useEffect } from "react";
import { TextInput, TouchableOpacity, Text, View, Image } from "react-native";
import { Styles } from "../Styles"

export default function ExpenseDetail({ page, navigation}) {
    <View style={[{ width: '100%', paddingHorizontal: 100, flex: 3, backgroundColor: '#F6EFEF'}]}>
    <TouchableOpacity 
        // key={e.routeName}
        style={Styles.btndetail}
        //onPress={()=> }
        >
        <Text style={Styles.text}> Edit </Text>
    </TouchableOpacity>
    </View>
}

