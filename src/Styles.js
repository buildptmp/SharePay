import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
    container: {
        flex:1, 
        paddingTop: 30, 
        flexDirection: 'column', 
        // justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#F6EFEF'
    },

    containeraddex: {
        flex:1,
        paddingTop: 20, 
        flexDirection: 'column', 
        // justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#F6EFEF',
        borderWidth: 1,
        borderRadius: 20,
    },

    containerginfo: {
        flex:1,
        paddingTop: 30, 
        flexDirection: 'column', 
        // justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#F6EFEF'
    },

    containerginfo: {
        flex:1,
        paddingTop: 30, 
        flexDirection: 'column', 
        // justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#F6EFEF'
    },

    containerAddmem: {
        flex: 2, 
        paddingTop: 30, 
        flexDirection: 'column', 
        // justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#F6EFEF'
    },

    logoImg: {
        width: '100%',
        resizeMode: 'contain',
        alignItems: 'center',
        flex: 2
    },
    input: {
        height: 40,
        width: '60%',
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#B6B6B6',
        backgroundColor: '#FFFFFF',

    },
    inputgroup: {
        height: 40,
        width: '100%',
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#B6B6B6',
        backgroundColor: '#FFFFFF',
    },

    descinput: {
        height: 80,
        width: '100%',
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#B6B6B6',
        backgroundColor: '#FFFFFF',
    },

    inputAddmem: {
        height: 40,
        width: '100%',
        marginLeft: 10,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#B6B6B6',
        backgroundColor: '#FFFFFF',

    },

    inputaddex: {
        height: 40,
        width: '100%',
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#B6B6B6',
        backgroundColor: '#FFFFFF',

    },

    btn: {
        backgroundColor: '#F88C8C',
        marginBottom: 10,
        padding: 10,
        borderRadius: 20,
    }, 

    btnginfo: {
        backgroundColor: '#F88C8C',
        marginBottom: 10,
        padding: 10,
        borderRadius: 20,
        width: '60%',
    }, 
    
    btnaddex: {
        backgroundColor: '#F88C8C',
        marginBottom: 10,
        padding: 10,
        borderRadius: 20,
        marginTop: 20,
        marginHorizontal:'20%'
    },

    btngif: {
        backgroundColor: '#F88C8C',
        // marginBottom: 10,
        margin: 10,
        borderRadius: 20,
        // marginTop: 20,
    },

     btnslip: {
        backgroundColor: '#F88C8C',
        marginTop: 20,
        padding: 10,
        borderRadius: 20,
    },

    btnph: {
        backgroundColor: '#F88C8C',
        width: '50%',
        marginTop: 10,
        padding: 10,
        borderRadius: 20,
        marginLeft:60 ,
    },

    text: {
        textAlign: 'center',
        color: 'white',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },

    containerLogin: {
        flex:1, 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    containerRegis: {
        flex:1, 
        flexDirection: 'column', 
        // justifyContent: 'center', 
        alignItems: 'center',
        paddingTop: 70,
    },

    dropDownBtnStyle: {
        height: 40,
        width: '20%',
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#B6B6B6',
        backgroundColor: '#FFFFFF',
    },
    
    list_container: {
        // flex: 1,
        paddingTop: 5,
        backgroundColor: '#F6EFEF',
    },

    list_container2: {
        // flex: 1,
        // paddingTop: 5,
        backgroundColor: '#F6EFEF',
        // width:"90%",
        padding: 10,
        // borderRadius: 20,
        // borderWidth:1,

    },

    list_container3: {
        // flex: 1,
        backgroundColor: '#F6EFEF',
        width:"100%",
    },

    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        fontSize: 22,
        fontWeight: 'bold',
    },
    sectionHeaderwithsub: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        fontSize: 20,
        fontWeight: 'bold',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    itemDesc: {
        padding: 10,
        fontSize: 12,
        // height: 44,
    },

    itemInput: {
        width: '80%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#fabbbb',
        marginBottom: 10,
    },

    shadowProp: {  
        shadowOffset: {width: 0, height: -3},  
        shadowColor: '#171717',  
        shadowOpacity: 0.2,  
        shadowRadius: 3,  
    },

    // drop down style
    dropdownBtnStyle: {
        width: '80%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#fabbbb',
        marginBottom: 10,
        },
    dropdownBtnTxtStyle: {color: '#444', textAlign: 'left'},
    dropdownDropdownStyle: {backgroundColor: '#EFEFEF', borderRadius:20},
    dropdownRowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
    dropdownRowTxtStyle: {color: '#444', textAlign: 'left'},

    //image picker style
    image_picker: {
        width: 200, 
        height: 200, 
        borderRadius: 100 
    }
});