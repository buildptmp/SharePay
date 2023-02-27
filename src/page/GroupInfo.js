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
import { editGroup } from '../../database/DBConnection';
import { async } from '@firebase/util';

export default function GroupInfo({ route, navigation }) {
    const { gid } = route.params
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
        // console.log(mList)
    };
    async function _showExpenseList(){
        let eList = await getExpenseListByGid(gid);
        setExpenseList(eList);
        // console.log(eList)
    };
    function _editGroup(){
        setEditGroupView(true);
    };
    async function _saveEditGroup(){
        const photoURL = (pickerRes.fileName != undefined ? await uploadGroupImg(pickerRes.fileName,pickerRes.uri,pickerRes.type):pickerRes.uri);
        editGroup(gid,gname, photoURL,gdesc);
        alert("Successfully edited.");
        setEditGroupView(false);
    }
    useEffect(() => {
        _showGroupInfo();
        _showMemberList();
        _showExpenseList();
    },[]);

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
    ListHeader = (props) => {
        return(
        <View style={{flexDirection:'row', paddingTop:10, justifyContent:'space-between'}}>
            <Text style={Styles.sectionHeader}>{props.title}</Text>
            <View style={{width:30, height:30, borderRadius:15, backgroundColor:"#F88C8C", marginRight:10}}>
            <FontAwesome
                name="plus"
                color="white"
                size={20}
                style={{alignSelf:'center', marginVertical:5}}
                onPress={() => navigation.navigate((props.title == "Expense item" ?'AddingExpense':'AddingMember'), {gid:gid, gname:gname})}>
            </FontAwesome>
            </View>
        </View>)
    };
    RenderItem = (props) => {
        return (
            <TouchableOpacity style ={{flex: 1}} onPress={() => 
                console.log(props.item.name)
                // navigation.navigate('ItemInfo',{eid:item.eid, ename:item.name})
            }>
                <View style={{
                    width: '100%',
                    height: 50,
                    backgroundColor: '#FFFFFF',
                    borderBottomWidth: 1,
                    borderColor: '#7E828A',
                    flexDirection: 'row'
                    }}>
                    {props.title == "Expense item" ? <Text style={Styles.item}>{props.index + 1}</Text>:<Image style={{borderRadius: 50, height:35, width:35,margin:5 }} source={{uri:props.item.image}}/>}    
                    <Text style={Styles.item}>{props.item.name}</Text>
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
                // onPress={_createGroup}
            >
                <Text style={Styles.text}>Leave group</Text>
            </TouchableOpacity>
            </View>
        )
    };
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
            //     <Text>There is nothing in the list.</Text>
            // }}
            renderSectionHeader={({section: {title}}) => <ListHeader title={title} />}
            ListFooterComponent={ () => <RenderFooter />}
            ListFooterComponentStyle={{paddingTop:20}}
        />
        </SafeAreaView> 
    );
};

