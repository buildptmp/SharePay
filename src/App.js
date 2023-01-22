import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navbar from './components/Navbar';
import { 
  Button, 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  SafeAreaView, 
  Image
} from "react-native";

// Screens
import UserSelect from './page/UserSelect'
import UserRegister from './page/UserRegister'
import Login from './page/Login'

const Stack = createStackNavigator();

const RouteMapping = [
  { name: 'UserSelect', page: UserSelect, },
  { name: 'Login', page: Login, },
  { name: 'UserRegister', page: UserRegister, },
]

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={RouteMapping[0].name} 
        screenOptions={{
          headerShown: true
        }}>
        {RouteMapping.map((e) => {
          return (
            <Stack.Screen key={e.name} name={e.name} component={e.page} />  
          )
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
