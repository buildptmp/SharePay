import React, { useEffect } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
// Screens
import Homepage from '../page/Homepage';
import GroupCreate from '../page/GroupCreate';
import Profilepage from '../page/Profilepage';
import Debtlist from '../page/Debtlist';
const NavBar = createBottomTabNavigator();
// const Navbar = () => {
//   return(
//     <Navbar.Navigator>
//       <Navbar.Screen name="Home" component={Homepage}/>
//       <Navbar.Screen name="Group Creation" component={GroupCreate}/>
//       <Navbar.Screen name="Profile" component={Profilepage}/>
//     </Navbar.Navigator>
//   )
// }


//Screen names
const Screens = [
  { name: 'Homepage', component: Homepage, icon: 'home-outline' },
  { name: 'Group Create', component: GroupCreate, icon: 'add-outline' },
  { name: 'Debt/Debtor', component: Debtlist, icon: 'wallet-outline' },
  { name: 'Profile', component: Profilepage, icon: 'person-outline' },
  
]

const Tab = createBottomTabNavigator();

function Navbar() {

  return (
    <Tab.Navigator
      initialRouteName={ Homepage }
      screenOptions={() => ({
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
        tabBarStyle: { padding: 10, height: 70 },
        // headerShown: false,
      })}
    >

      {Screens.map((e) => {
        return (
          <Tab.Screen 
            key={e.name}
            name={e.name} 
            component={e.component} 
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name={e.icon} color={color} size={size} />
              ),
              tabBarBadge: e.name == "Profile" && global.NotiSignal ? "":null
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

export default Navbar;
