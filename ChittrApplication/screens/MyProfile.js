import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, Alert ,Text ,Image ,TouchableHighlight } from 'react-native';
import { Container, Footer } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

{/* Retrieves ID and token of logged-in user from async storage.
	ID used to retrieve user's details and recent chits.
	Token used in verifying user is logged in when logging out of account.
	current states (id, email etc) carried across to Update screen.*/}

class MyProfile extends Component {
    constructor(props){
        super(props);
        this.state ={
			given_name: '',
			family_name: '',
			email: '',
			id: '',
			isLoading: true
        }
    }

	async getID(){
		try {
		    let id = await AsyncStorage.getItem('id')
		    console.log(id)        
		    if(id !== null) {
				return id
		    }
				return id
		} catch(e) {
			console.error(e)
		}
	} 

	async getToken(){
		try {
			let token = await AsyncStorage.getItem('token')
			console.log("Token is!: " + token)
			if(token !== null) {
				return token
			}
				return token
			} catch(e) {
				console.error(e)
			}
    }
	componentDidMount(){
		this.getID().then((id) =>{
			this.setState({id: id})
			this.getProfile(id)
		})
	}

	logout(){
		this.getToken().then((token) =>{
			return fetch('http://10.0.2.2:3333/api/v0.0.5/logout/',
			{
				method: 'POST',
				headers: {
				'X-Authorization': token
				},
			})
			.then((response) => {
				Alert.alert("Logged out")
				this.props.navigation.navigate('Home')
			})
			.catch((error) => {
				Alert.alert("Error Logging Out");
				console.error(error);
			});
		})
	}

	getProfile(id){
		return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' +id,
			{
				method: 'GET',
				headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
				},
			})
			.then((response) => {
				response.json().then(json => {
				let fname = (json)['given_name']
				let lname = (json)['family_name']
				let email = (json)['email']

				console.log(lname)
			  
				this.setState({given_name: fname})
				this.setState({family_name: lname})
				this.setState({email: email})
				this.setState({isLoading: false})
				});
			})
			.catch((error) => {
				Alert.alert("Error Retrieving Account Details!");
				console.error(error);
			});
	}

	render(){
		return(
			<Container style={styles.container}>
				<Image style={styles.image}
					source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.id + '/photo/'}}
				/>
    
				<Text style={styles.text}>{this.state.given_name} {this.state.family_name}</Text>
				<Text style={styles.text}>{this.state.email}</Text>

				<View>
					<TouchableHighlight
					underlayColor= '#f19292'
					style={styles.button}
					onPress={() => {
						this.props.navigation.navigate('Update',{
							givenName: this.state.given_name,
							familyName: this.state.family_name,
							email: this.state.email,
							id: this.state.id
						})
					}}>
						<Text style={styles.buttonText}>Update Your profile</Text>
					</TouchableHighlight>
					
					<TouchableHighlight
					underlayColor= '#f19292'
					style={styles.button}
					onPress={() => {
						 this.props.navigation.navigate('Following',{
							id: this.state.id
						  })
					}}>
					<Text style={styles.buttonText}>Users You Follow</Text>
					</TouchableHighlight>
					
					<TouchableHighlight
						underlayColor= '#f19292'
						style={styles.button}
						onPress={() => {
							this.props.navigation.navigate('Followers',{
							id: this.state.id
							})
					}}>
						<Text style={styles.buttonText}>Your Followers</Text>
					</TouchableHighlight>
					
					<TouchableHighlight
						underlayColor= '#f19292'
						style={styles.button}
						onPress={() => {
							this.props.navigation.navigate('Login')
							this.logout()
					}}>
						<Text style={styles.buttonText}>Logout</Text>
					</TouchableHighlight>
				</View>
			</Container>
    );
  }
}

const styles = StyleSheet.create({
	container: {flex: 1,backgroundColor: '#e1f4f3',alignItems: 'center'},
	text: {color: '#333333',textAlign: 'center',fontSize: 20,marginTop: 10},
	image: {height: 250,width: 250, margin: 10,justifyContent: 'center',alignItems: 'center'},
	button: {alignItems: 'center',backgroundColor: '#ffffff', padding: 8, marginTop: 10, borderRadius: 10},
	buttonText: {  color: '#706c61',  fontSize: 12 }
});


export default MyProfile