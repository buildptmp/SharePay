import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
    container: {
        flex:1, 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
    },

    containerAddmem: {
        flex: 2, 
        flexDirection: 'column', 
        justifyContent: 'center', 
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
        width: '100%',
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#B6B6B6',
        backgroundColor: '#FFFFFF',

    },

    inputAddmem: {
        height: 40,
        width: '90%',
        marginBottom: 10,
        marginLeft: 10,
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

    btnph: {
        backgroundColor: '#F88C8C',
        width: '50%',
        marginTop: 20,
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
        justifyContent: 'center', 
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
    dropDownCredBtnStyle: {
        height: 40,
        width: '100%',
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#B6B6B6',
        backgroundColor: '#FFFFFF',
    },

});