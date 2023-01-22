{/* import required component and node_modules */}
import React, { Component } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
	{/* Import Screens */}
import Login from './screens/Login'
import Home from './screens/Home'
import Create from './screens/Create'
import Chits from './screens/Chits'
import MyProfile from './screens/MyProfile'
import Search from './screens/Search'
import Post from './screens/Post'
import Photo from './screens/Photo'
import UserProfile from './screens/UserProfile'
import Update from './screens/Update'
import Followers from './screens/Followers'
import Following from './screens/Following'
import ProfilePhoto from './screens/ProfilePhoto'
import Drafts from './screens/Drafts'

const Stack = createStackNavigator();

class App extends Component {

	render(){
		return(
		  <NavigationContainer>
			<Stack.Navigator initialRouteName = "Home"
			  screenOptions={{
				headerShown: false,
			  }}>
			  {/* add screens to stack navigator*/}
				<Stack.Screen
					name = "Home"
					component = {Home}
				/>
				
				<Stack.Screen
					name = "Login"
					component = {Login}
				/>
				
				<Stack.Screen
					name="Create"
					component={Create}
				/>

				<Stack.Screen
					name = "Chits"
					component = {Chits}
				/>
					
				<Stack.Screen
					name="Search"
					component={Search} 
				/>
					
				<Stack.Screen
					name="MyProfile"
					component={MyProfile}
				/>

				<Stack.Screen
					name="Post"
					component={Post}
				/>
					
				<Stack.Screen
					name="Photo"
					component={Photo}
				/>

				<Stack.Screen
					name="UserProfile"
					component={UserProfile}
				/>

				<Stack.Screen
					name="Update"
					component={Update}
				/>

				<Stack.Screen
					name="Followers"
					component={Followers}
				/> 
					
				<Stack.Screen
					name="Following"
					component={Following}
				/> 

				<Stack.Screen
					name="Drafts"
					component={Drafts} 
				/>
				
				<Stack.Screen
					name="ProfilePhoto"
					component={ProfilePhoto}
				/>
				
			</Stack.Navigator>
		  </NavigationContainer>
		);
    }
}
export default App