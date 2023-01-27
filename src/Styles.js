import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
    container: {
        flex:1, 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
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
    btn: {
        backgroundColor: '#F88C8C',
        marginBottom: 10,
        padding: 10,
        borderRadius: 20,
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

});