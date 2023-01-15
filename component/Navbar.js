import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import Homepage from '../page/Homepage';
import GroupCreate from '../page/GroupCreate';
import Profilepage from '../page/Profilepage';

//Screen names
const homepageName = "Home";
const groupCreateName = "Group Create";
const profilePageName = "Profile";

const Tab = createBottomTabNavigator();

function Navbar() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={Homepage}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === Homepage) {
              iconName = focused ? 'Home' : 'list-outline';

            } else if (rn === GroupCreate) {
              iconName = focused ? 'GroupCreate' : 'list-outline';

            } else if (rn === Profilepage) {
              iconName = focused ? 'Profile' : 'settings-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'grey',
          labelStyle: { paddingBottom: 10, fontSize: 10 },
          style: { padding: 10, height: 70}
        }}>

        <Tab.Screen name={homepageName} component={Homepage} />
        <Tab.Screen name={groupCreateName} component={GroupCreate} />
        <Tab.Screen name={profilePageName} component={Profilepage} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default Navbar;
