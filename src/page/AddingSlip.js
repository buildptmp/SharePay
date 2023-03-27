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
    ScrollView,
    Modal,
 } from "react-native";
import { get_access_key, getpaymentInfo } from "../../database/api";
import { timecheck, datecheck } from '../../database/DBConnection';
import { imagePicker, uploadSlip } from '../../database/Storage'
import auth from '@react-native-firebase/auth';
import SuccessAdd from '../components/SuccessAdd';

export default function AddingSlip({ navigation, route }) {
    const {amount,timestamp, data} = route.params;
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

    async function checkSlip(){
        if(pickerRes.fileName != undefined){
            if(apiRespose && apiRespose.status == 'Success'){console.log("1")
                const t_check = timecheck(timestamp, apiRespose.time)
                const d_check = datecheck(timestamp, apiRespose.date)
                if(t_check>=0 && d_check>=0){
                    if(apiRespose.amount == amount){
                        const uid = auth().currentUser.uid;
                        // await updateDebtor(eid, uid)
                    } else{
                        alert("the amount in slip is not equal to the total amount of the expense price.")
                    }
                } else {
                    alert("This slip's timestamp is OLD-TIME than the slip creation's timestamp.\n\nIf you have paid for the debt, please contact the owner to change the debt status for you.")
                }
                
                await _saveSlip()
            } else{
                alert("Fail to validate the slip.")
                // show unsuccessmodal()
            }
        } else {
            alert("Cannot find a slip.")
        }
        
    }

    async function _saveSlip(){
        // console.log(pickerRes.fileName,pickerRes.uri,pickerRes.type)
        const photoURL = await uploadSlip(pickerRes.fileName,pickerRes.uri,pickerRes.type)
        // console.log(photoURL);
    }

    useEffect(()=>{
        async function callapi(transRef){
            const response = await getpaymentInfo(transRef);
            setResponse(response);
        }
        if(transRef){
            callapi(transRef);
        }
        // console.log(transRef)
    },[transRef])

    // const PoppuSlipVerificationSuccessful = (
    //     <View>

    //     </View>
    // )

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
                            <Text style={{fontWeight:'bold',padding:100}}>select a slip</Text>
                        </View>
                    }
                </TouchableOpacity>
            
        
                <View style={[{ width: '100%', paddingHorizontal: 100, backgroundColor: '#F6EFEF', marginTop:10}]}>
                    <Text style={Styles.textboxtop}>Group: {data.gname}</Text>
                    <Text style={Styles.textboxtop}>From: {data.from}</Text>
                    <Text style={Styles.textboxtop}>To: {data.to} </Text>
                    <Text style={Styles.textboxtop}> Amount: {amount} </Text>
                    <TouchableOpacity 
                        // key={e.routeName}
                        style={Styles.btnslip}
                        onPress={ ()=> {
                            // await checkSlip();
                            // alert('Upload Successfully.');
                            alert('Implementing.');
                            // if("Slip is valid"){
                                // checkSlip()
                                // uploadSlip()
                                // showSuccessModal()
                            // } else {showUnsuccessModal()}
                        }}
                    >
                        <Text style={Styles.text}> Confirm </Text>
                    </TouchableOpacity>
                    {/* <SuccessAdd /> */}
                </View>
            </View> 
        </ScrollView>
    );
};

