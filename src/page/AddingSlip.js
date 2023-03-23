import * as React from 'react';
import { Styles } from "../Styles"
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
    ScrollView
 } from "react-native";
import { get_access_key, getpaymentInfo } from "../../database/api";
import { timecheck, datecheck } from '../../database/DBConnection';
import { imagePicker, uploadSlip } from '../../database/Storage'
import auth from '@react-native-firebase/auth';

export default function AddingSlip({ navigation, route }) {
    const {amount,timestamp, eid, data} = route.params
    const uid = auth().currentUser.uid;
    const [GroupName, setGroupName] = useState(null);
    const [GroupDesc, setGroupDesc] = useState(null);
    const [pickerRes, setPickerRes] = useState({uri:""});
    const [transRef, setTransRef] = useState("202303143qO8X3qczVArfqJ");
    const RouteMapping = [
        { routeName: 'Add Member', displayText: 'Add Member', }
    ]
    const [apiRespose, setResponse] = useState("");

    async function chooseFile() {
        const response = await imagePicker()
        if (!response.didCancel){
            setPickerRes(response)
        }
    };

    function checkSlip(){
        if(apiRespose && apiRespose.statue == 'success'){
            const t_check = timecheck(timestamp, apiRespose.time)
            const d_check = datecheck(timestamp, apiRespose.date)
            if(t_check>=0 && d_check>=0){
                if(apiRespose.amount == amount){
                    // await updateDebtor(eid, uid)
                } else{
                    alert("the amount in slip is not equal to the total amount of the expense price.")
                }
            } else {
                alert("This slip's timestamp is OLD-TIME than the slip creation's timestamp.\nIf you have paid for the debt, please contact the owner to change the debt status for you.")
            }
        } else{
            alert("Fail to validate the slip.")
        }
    }

    useEffect(()=>{
        async function callapi(transRef){
            const response = await getpaymentInfo(transRef);
            setResponse(response);
        }
        if(transRef){
            callapi(transRef);
        }
    },[transRef])

    return(
        <ScrollView>
            <View style={Styles.container}>
                {/* <View style={[{flex:1}]} /> */}
                <TouchableOpacity onPress={chooseFile}>
                    {
                        pickerRes.uri ? 
                        <Image style = {Styles.image_picker_slip} source={{uri: pickerRes.uri}}></Image>
                        :
                        <View style={{ justifyContent:'center'}}>
                            <Text style={{fontWeight:'bold',padding:100}}>upload a slip</Text>
                        </View>
                    }
                </TouchableOpacity>
            
        
                <View style={[{ width: '100%', paddingHorizontal: 100, backgroundColor: '#F6EFEF', marginTop:10}]}>
                    <Text style={Styles.textboxtop}>Group: (wait for data)</Text>
                    <Text style={Styles.textboxtop}>From: 'Debtor'</Text>
                    <Text style={Styles.textboxtop}>To: 'Creditor' </Text>
                    <Text style={Styles.textboxtop}> Amount: 'Price' </Text>
                    <TouchableOpacity 
                        // key={e.routeName}
                        style={Styles.btnslip}
                        onPress={async ()=> {
                            // await checkSlip();
                            // alert('Upload Successfully.');
                            alert('Implementing.');
                        }}
                    >
                        <Text style={Styles.text}> Confirm </Text>
                    </TouchableOpacity>
                </View>
            </View> 
        </ScrollView>
    );
};

