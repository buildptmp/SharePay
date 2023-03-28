import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import AntDesign from 'react-native-vector-icons/AntDesign'; 

// Screens
import UserSelect from './page/UserSelect'
import UserRegister from './page/UserRegister'
import UserInformation from './page/UserInformation'
import AddingMember from './page/AddingMember';
import NavBar from './components/Navbar';
import AddingExpense from './page/AddingExpense'
import GroupInfo from './page/GroupInfo';
import Profilepage from './page/Profilepage';
import AddingSlip from './page/AddingSlip';
import ProfileInfo from './page/ProfileInfo';
import ItemInfo from './page/ItemInfo';
import Notification from './page/Notification';
import ExpenseDetail from './page/ExpenseDetail';

const Stack = createStackNavigator();

const RouteMapping = [
  { name: 'UserSelect', page: UserSelect },
  { name: 'Register', page: UserRegister },
  { name: 'Add Member' , page: AddingMember },
  { name: 'User Information', page: UserInformation },
  { name: 'Create Expense' , page: AddingExpense },
  { name: 'Group' , page: GroupInfo },
  { name: 'Profile' , page: Profilepage },
  { name: 'Add Slip' , page: AddingSlip },
  { name: 'Edit Profile', page: ProfileInfo },
  { name: 'Item Information' , page: ItemInfo },
  { name: 'Notification' , page: Notification },
  { name: 'Detail' , page: ExpenseDetail }
]

const FontsLoader = () => {
  Ionicons.loadFont()
  Fontisto.loadFont()
  Feather.loadFont()
  FontAwesome.loadFont()
  AntDesign.loadFont()
}

const App = () => {
  FontsLoader()

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={RouteMapping[0].name} 
        screenOptions={{
          headerShown: true
        }}>
        {RouteMapping.map((e,index) => {
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
