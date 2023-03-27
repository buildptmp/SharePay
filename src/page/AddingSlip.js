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
import { timecheck, datecheck, uploadSlipDebt, getSlip} from '../../database/DBConnection';
import { imagePicker, uploadSlip } from '../../database/Storage'
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import SuccessAdd from '../components/SuccessAdd';
import { Tooltip } from 'react-native-elements';

export default function AddingSlip({ navigation, route }) {
    const {amount,timestamp, data, slipURL} = route.params;
    const [GroupName, setGroupName] = useState(null);
    const [GroupDesc, setGroupDesc] = useState(null);
    const [pickerRes, setPickerRes] = useState({uri:""});
    const [transRef, setTransRef] = useState("202303143qO8X3qczVArfqJ");
    const RouteMapping = [
        { routeName: 'Add Member', displayText: 'Add Member', }
    ]
    const [apiRespose, setResponse] = useState("");
    const [slip, setSlip] = useState("");

    async function chooseFile() {
        const response = await imagePicker()
        if (!response.didCancel){
            setPickerRes(response)
        }
    };

    async function checkSlip(){
        if(pickerRes.fileName != undefined){
            if(apiRespose && apiRespose.status == 'Success'){console.log("1")
                const uid = auth().currentUser.uid;
                await _saveSlip()

                const t_check = timecheck(timestamp, apiRespose.time)
                const d_check = datecheck(timestamp, apiRespose.date)
                if(t_check>=0 && d_check>=0){
                    if(apiRespose.amount == amount){
                        const uid = auth().currentUser.uid;
                        // await updateDebtor(eid, uid) to be paid
                    } else{
                        alert("the amount in slip is not equal to the total amount of the expense price.")
                    }
                } else {
                    alert("This slip's timestamp is OLD-TIME than the slip creation's timestamp.\n\nIf you have paid for the debt, please contact the owner to change the debt status for you.")
                }
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
        if(photoURL) {
            await uploadSlipDebt(data.to.uid,data.from.uid,data.group.gid,photoURL);
            // alert("upload a slip successfully")
            setSlip(photoURL)
        } else console.log("upload error")
        
    }

    useEffect(()=>{
        async function callapi(transRef){
            const response = await getpaymentInfo(transRef);
            setResponse(response);
        }
        if(transRef){
            callapi(transRef);
        }
        if(slipURL){
            setPickerRes({uri:slipURL.slipURL})
            setSlip(slipURL.slipURL)
        }
        // console.log(transRef)
    },[transRef,slip])

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
                {
                    (slip || slipURL) && 
                    <View style={{flexDirection:'row', margin:10}}>
                        <Text style={{fontSize:40,color:'#4FC978',fontWeight:'bold'}}>Verified</Text>
                        <Tooltip ModalComponent={Modal} popover={<Text>Verified only show that the uploaded slip is a real transaction occurred. {"\n\n"}(not for checking the amount price to pay)</Text>} 
                            containerStyle={{borderColor:"#F88C8C", borderWidth:1.5, backgroundColor:'#F6EFEF', margin:5, height:120,width:250}}>
                            <Feather name="alert-circle"/>
                        </Tooltip>
                    </View>
                }
                    
                <View style={[{backgroundColor: '#F6EFEF', marginTop:10, justifyContent:'center', alignItems:'center'}]}>
                    <Text style={{fontSize:18,color:'black',fontWeight:'bold'}}>Information</Text>
                    <Text>Group: {data.group.name}</Text>
                    <Text>From: {data.from.name}</Text>
                    <Text>To: {data.to.name} </Text>
                    <Text> Amount: {amount} </Text>
                    <TouchableOpacity 
                        // key={e.routeName}
                        style={[Styles.btnslip, {marginBottom:10}]}
                        onPress={ async ()=> {
                            await checkSlip();
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

