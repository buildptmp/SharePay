import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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
import UserInformation from './page/UserInformation'
import AddingMember from './page/AddingMember';
import NavBar from './components/Navbar';

const Stack = createStackNavigator();

const RouteMapping = [
  { name: 'UserSelect', page: UserSelect },
  { name: 'UserRegister', page: UserRegister },
  { name: 'AddingMember' , page: AddingMember },
  { name: 'UserInformation', page: UserInformation },
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
        <Stack.Screen name='Root' component={NavBar} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
