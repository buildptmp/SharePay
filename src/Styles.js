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
        paddingBottom: 20,
        flexDirection: 'column', 
        // justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#F6EFEF',
        // borderWidth: 1,
        borderRadius: 20,
        marginTop: 10,
        marginBottom:10
    },

    containerdlist: {
        flexDirection: 'row',
        backgroundColor: '#F6EFEF'
    },


    containerdlist2:{
        flex: 1,
        marginTop: 8,
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

    containerRating: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
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
        // marginLeft: 10,
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

    btnrate: {
        backgroundColor: '#F88C8C',
        marginBottom: 10,
        padding: 7,
        borderRadius: 20,
        width:'25%',
        alignSelf:'center',
    }, 

    btnprofile: {
        backgroundColor: '#F88C8C',
        marginBottom: 10,
        padding: 10,
        borderRadius: 20,
        width: '50%',
    }, 

    btnprofileinfo: {
        backgroundColor: '#F88C8C',
        marginBottom: 10,
        padding: 10,
        borderRadius: 20,
        width: '100%',
    }, 

    btnsavechn: {
        backgroundColor: '#6EC7B1',
        marginBottom: 10,
        padding: 10,
        borderRadius: 20,
        width: '100%',
    }, 

    btnlogout: {
        backgroundColor: '#E24B4B',
        marginBottom: 10,
        padding: 10,
        borderRadius: 20,
        width: '50%',
    }, 

    btnlist: {
        backgroundColor: '#F1D2D2',
        marginBottom: 10,
        padding: 15,
        width: '50%',
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

    btnpopup: {
        backgroundColor: '#F88C8C',
        // marginBottom: 10,
        padding: 10,
        borderRadius: 20,
        // marginTop: 10,
        // marginHorizontal:'20%'
    },

    btnitif: {
        backgroundColor: '#F88C8C',
        marginBottom: 10,
        padding: 10,
        borderRadius: 20,
        // marginTop: 10,
        marginHorizontal:'20%'
    },

    btnitif_v2: {
        backgroundColor: '#F88C8C',
        padding: 10,
        borderRadius: 20,
    },

    btngif: {
        backgroundColor: '#F88C8C',
        // marginBottom: 10,
        margin: 10,
        borderRadius: 20,
        // marginTop: 20,
    },

    btnaddslip: {
        backgroundColor: '#F88C8C',
        padding: 10,
        borderRadius: 20,
        width:110,
        marginLeft:10,
        right:10
    }, 

    btnslip: {
        backgroundColor: '#F88C8C',
        marginTop: 20,
        padding: 10,
        borderRadius: 20,
        width:100
    },

    btndetail: {
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

    selected: {
        backgroundColor: '#F88C8C',
        borderWidth: 0,
    },

    selectedLabel: {
        color: 'white',
      },

    text: {
        textAlign: 'center',
        color: 'white',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },

    debttext1: {
        //textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 17,
        width: '25%',
        fontWeight: 'bold',
        // backgroundColor:"pink"
    },

    debttext2: {
        //textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 17,
        fontWeight: 'bold',
        width: '20%',
        // backgroundColor:"lightblue",
        textAlign:'center'
    },

    debttext3: {
        //textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 17,
        alignItems: 'flex-end',
        fontWeight: 'bold',
        width: '25%',
        textAlign:'right',
        marginRight:10
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
        paddingTop: 10,
        backgroundColor: '#F6EFEF',
        paddingBottom: 10,
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

    sectionHeaderDebtDebtorList: {
        fontSize: 22,
        fontWeight: 'bold',
    },

    sectionHeaderdebtdetail: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },

    bio: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        fontSize: 20,
    },

    sectionHeaderwithsub: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        fontSize: 20,
        fontWeight: 'bold',
    },
    textInputHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        // paddingRight: 10,
        paddingBottom: 5,
        fontSize: 16,
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
        borderWidth: 2,
        borderColor: '#fabbbb',
        marginBottom: 10,
        paddingLeft:10,
        paddingRight:10,
    },

    itemInputCheckboxContainer: {
        // flex:1,
        width: '45%',
        height: '80%',
    },

    itemInputCheckboxBorder:{
        backgroundColor: '#FFF',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#fabbbb',
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
        borderWidth: 2,
        borderColor: '#fabbbb',
        marginBottom: 10,
    },
    
    dropdownBtnStyle2: {
        width: '25%',
        height: 30,
        backgroundColor: '#FFF',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#fabbbb',
        //marginBottom: 5,
    },

    dropdownBtnTxtStyle: {color: '#444', textAlign: 'left'},
    dropdownBtnTxtStyle2: {color: '#444', textAlignVertical: 'center', paddingBottom: 5},
    dropdownDropdownStyle: {backgroundColor: '#EFEFEF', borderRadius:20},
    dropdownRowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
    dropdownRowTxtStyle: {color: '#444', textAlign: 'left'},

    //image picker style
    image_picker: {
        width: 200, 
        height: 200, 
        borderRadius: 100 
    },

    image_picker_slip: {
        width: 350,
        // width,
        height: 500,
        // backgroundColor: "white",
        resizeMode: 'contain'
    },

    image_picker_sip_shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    Iteminfo: {
        //width: '100%',
        // height: 50,
        paddingVertical:3,         
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderColor: '#7E828A',                
        flexDirection: 'row',
    },

    box: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        borderBottomWidth:1,
        borderTopWidth:1,
        borderColor: '#E3E3E3',
        padding: 10,
        backgroundColor: 'white',
    },

    //pop up confirming adding expense model view
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },

      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },

});