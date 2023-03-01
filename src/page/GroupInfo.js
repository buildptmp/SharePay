import * as React from 'react';
import { Styles } from "../Styles"
import { FC, useEffect, ReactElement, useState, useRef} from "react";
import { Button, 
    StyleSheet, 
    SectionList,
    Text,
    TextInput , 
    View, 
    FlatList, 
    SafeAreaView, 
    Image,
    TouchableOpacity,
 } from "react-native";
import auth from '@react-native-firebase/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import { getGroupByGid, getMemberListByGid, getExpenseListByGid } from '../../database/DBConnection'
import { uploadGroupImg, imagePicker } from '../../database/Storage'
import { editGroup, checkAllowToleave, addEditGroupMember, deleteGroup } from '../../database/DBConnection';
import { async } from '@firebase/util';

export default function GroupInfo({ route, navigation }) {
    const { gid } = route.params
    const uid = auth().currentUser.uid
    const [isReadyM, setReadyM] = useState(false);
    const [isReadyE, setReadyE] = useState(false);
    const [memberList, setMemberList] = useState([{}]);
    const [expenseList, setExpenseList] = useState([{}]);
    const [gname, setgName] = useState("")
    const [gdesc, setgDesc] = useState("")
    const [pickerRes, setPickerRes] = useState({uri:"https://firebasestorage.googleapis.com/v0/b/sharepay-77c6c.appspot.com/o/assets%2FAddMem.png?alt=media&token=713f3955-809a-47e6-9f4c-4e93ac53dcd9"})
    const [editGroupView, setEditGroupView] = useState(false)
    const textInputRefname = useRef(null);
    const textInputRefdesc = useRef(null);
    const listRef = useRef(null);

    async function _showGroupInfo(){
        const groupInfo = await getGroupByGid(gid)
        setgName(groupInfo.name)
        setPickerRes({uri:groupInfo.image})
        setgDesc(groupInfo.description)
    };
    async function _showMemberList(){
        let mList = await getMemberListByGid(gid);
        setMemberList(mList);
        setReadyM(true)
        // console.log(mList)
    };
    async function _showExpenseList(){
        let eList = await getExpenseListByGid(gid);
        setExpenseList(eList);
        // console.log(eList)
        setReadyE(true)
    };
    
    useEffect(() => {
        setReadyE(false)
        setReadyM(false)
        _showGroupInfo();
        _showMemberList();
        _showExpenseList();
    },[]);

    // Start edit group section
    function _editGroup(){
        setEditGroupView(true);
    };
    async function _saveEditGroup(){
        const photoURL = (pickerRes.fileName != undefined ? await uploadGroupImg(pickerRes.fileName,pickerRes.uri,pickerRes.type):pickerRes.uri);
        editGroup(gid,gname, photoURL,gdesc);
        alert("Successfully edited.");
        setEditGroupView(false);
    }
    async function chooseFile() {
        const response = await imagePicker()
        if (!response.didCancel){
            setPickerRes(response)
        }
    };
    editName = () => {
        textInputRefname.current.focus();
    };
    editDesc = () => {
        textInputRefdesc.current.focus();
    }
    // End edit group section

    // Start leave group section
    async function _leaveGroup(){
        const checker = await checkAllowToleave(uid,gid);
        let text = "";
        if(!checker.creditor){
            text += "Warn! You are being the creditor in uncompleted recalling the debt yet.\n\n";
        }
        if(!checker.debtor){
            text += "Warn! You are being the debtor in some expense, Please reimburse your debt before you go.";
        }
        if(checker.creditor && checker.debtor){
            addEditGroupMember(gid,uid,"left");
            alert("Leaving successfully.");
            _checkEmptyMemberInGroup();
        }
        else{
           alert(text);
        }
    }
    // End leave group section

    function _checkEmptyMemberInGroup(){
        getMemberListByGid(gid).then(result =>{
            // console.log(result)
            if(result==false){
                deleteGroup(gid)
            }
        })
    }
    // Start render list section
    ListHeader = (props) => {
        return(
        <View style={{flexDirection:'row', marginTop:10, justifyContent:'space-between', alignContent:'center'}}>
            <Text style={Styles.sectionHeader}>{props.title}</Text>
            <View style={{width:30, height:30, borderRadius:15, backgroundColor:"#F88C8C", margin:3, marginRight:25}}>
            <FontAwesome
                name="plus"
                color="white"
                size={18}
                style={{alignSelf:'center', marginVertical:6, marginLeft:0.6}}
                onPress={() => navigation.navigate((props.title == "Expense item" ?'AddingExpense':'AddingMember'), {gid:gid, gname:gname})}>
            </FontAwesome>
            </View>
        </View>)
    };
    RenderItem = (props) => {
        return (
            <TouchableOpacity style ={{flex: 1}} onPress={() => 
                //console.log(props.item.name)
                navigation.navigate('ItemInfo',{eid:props.item.eid, ename:props.item.name, gid:gid, price: props.item.price})
                //navigation.navigate('ItemInfo')
            }>
                <View style={{
                    // width: '100%',
                    // height: 50,
                    paddingVertical:3,
                    backgroundColor: '#FFFFFF',
                    borderBottomWidth: 1,
                    borderColor: '#7E828A',
                    flexDirection: 'row',
                    }}>
                    <View style={{width: '80%',flexDirection: 'row',}}>
                        {props.title == "Expense item" ? <Text style={Styles.item}>{props.index + 1}</Text>:<Image style={{borderRadius: 50, height:35, width:35,margin:5 }} source={{uri:props.item.image}}/>}    
                        <View style={{}}>
                            <Text style={Styles.item}>{props.item.name}</Text> 
                            {props.title == "Expense item" ? <Text style={Styles.itemDesc}>Creditor name {props.item.creditor.name}</Text> : null }
                        </View>
                    </View>
                    <View style={{width: '20%',justifyContent:'center'}}>
                        {props.title == "Expense item" ? <Text style={[Styles.item,{alignSelf:'flex-end', paddingRight:30}]}>{props.item.price}</Text>:null}
                    </View>
                </View>
            </TouchableOpacity>
        )
    };
    RenderFooter = (props) => {
        return(
        <View style={{height:220, alignItems: 'center'}}>
            <TouchableOpacity 
                style={Styles.btnginfo}
                onPress={_editGroup}
            >
                <Text style={Styles.text}>Edit group</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={Styles.btnginfo}
                onPress={_leaveGroup}
            >
                <Text style={Styles.text}>Leave group</Text>
            </TouchableOpacity>
            </View>
        )
    };
    // Start render list section
    return(
        <SafeAreaView style={Styles.list_container3}>
            
            {editGroupView ? 
            <View style={{width:'100%', height: 120,flexDirection:'row', backgroundColor:'#FDCECE'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <View style={{flexDirection:'column',marginLeft:10}}>
                        <Image style={{ borderRadius: 40, height:80, width:80}} source={{uri:pickerRes.uri}}/>
                        <TouchableOpacity onPress={chooseFile} style={{alignItems:'center'}}><Text>edit</Text></TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'column',marginLeft:10}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <TextInput ref={textInputRefname} onChangeText={(text) => setgName(text)} style={{marginLeft:20, fontWeight:'bold', fontSize:25, borderBottomColor:'black', borderBottomWidth:1}}>{gname}</TextInput>
                            <TouchableOpacity onPress={editName}><Text style={{marginTop:8,marginLeft:5}}>edit</Text></TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <TextInput ref={textInputRefdesc} onChangeText={(text) => setgDesc(text)} style={{marginLeft:20, fontSize:16, color:'#555454'}}>{gdesc}</TextInput>
                            <TouchableOpacity onPress={editDesc}><Text style={{marginTop:8,marginLeft:5}}>edit</Text></TouchableOpacity>
                        </View>
                    </View>
                    
                </View>
                <View style={{flexDirection:'column', alignItems:'flex-end', right:10, position:'absolute',justifyContent:'space-between', }}>
                    <AntDesign name="close" color="black" size={25} style={{ marginTop:10, marginBottom:50}} onPress={() => 
                        setEditGroupView(false)} />
                
                    <TouchableOpacity onPress={_saveEditGroup} style={{ marginBottom:10,borderRadius:10, borderColor:'#DE7272',borderWidth:1, backgroundColor:'#EB9090',width:75}}><Text style={{padding:2, color:'#F6EFEF', alignSelf:'center', fontWeight:'bold'}}>Save edit</Text></TouchableOpacity>
                </View> 
            </View>
            : null}
            {
                isReadyE && isReadyM && 
                <SectionList
                ref={listRef}
                sections={[
                    {title: 'Expense item', data: expenseList},
                    {title: 'Member', data: memberList},
                ]}
                renderItem={({item, index, section}) => 
                    <RenderItem item={item} title={section.title} index={index}/>
                }
                keyExtractor={(item, index) => item + index}
                // ListEmptyComponent={()=>{
                //     <Text>There is no member in this group.</Text>
                // }}
                renderSectionHeader={({section: {title}}) => <ListHeader title={title} />}
                ListFooterComponent={ () => <RenderFooter />}
                ListFooterComponentStyle={{paddingTop:20}}
                />
            }
            
        </SafeAreaView> 
    );
};

