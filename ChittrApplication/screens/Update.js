import React, { Component } from 'react';
import { TextInput, StyleSheet, TouchableHighlight , Alert, Text } from 'react-native';
import { Container } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

class Update extends Component {
	constructor(props){
		super(props);
		this.state ={
			given_name: '',
			family_name: '',
			email: '',
			password: '',
			id: ''
		}
	}
	
	async getToken(){
		try {
			let token = await AsyncStorage.getItem('token')
			console.log("Token: " + token)
			if(token !== null) {
				return token
			}
			return token
		} catch(e) {
			console.error(e)
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

	
	updateAccount(){
		this.getToken().then((token) =>{
			let updateDetails = JSON.stringify({
				given_name: this.state.given_name,
				family_name: this.state.family_name,
				email: this.state.email,
				password: this.state.password
			});
			console.log(updateDetails);
			return fetch("http://10.0.2.2:3333/api/v0.0.5/user/"+this.props.route.params.id,
			{
				method: 'PATCH',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-Authorization' : token
				},
			body: updateDetails
			})
			.then((response) => {
				if(response.ok){
					Alert.alert("Account Updated");
					this.props.navigation.navigate('MyProfile')
				}
				else{
					Alert.alert("Error Updating Account!, Please Check Your Details Are Correct");
				}

			}).catch((error) => {
				console.log(error);
			});
		})
	}

	render(){
		return(
			<Container style={styles.container}>
				<Text style={styles.text}>Enter Updated Details Below</Text>
				<TextInput
					placeholder='First Name'
					style={styles.textField}
					onChangeText={given_name => this.setState({given_name: given_name})}
				/>

				<TextInput
					placeholder='Last Name'
					style={styles.textField}
					onChangeText={family_name => this.setState({family_name: family_name})}
				/>
				
				<TextInput
					placeholder='Email'
					style={styles.textField}
					onChangeText={email => this.setState({email: email})}
				/>

				<TextInput
					placeholder='Password'
					style={styles.textField}
					onChangeText={password => this.setState({password: password})}
				/>
				<TouchableHighlight
					underlayColor= '#f19292'
					style={styles.button}
					onPress={() => {
					this.updateAccount();
				}}>
					<Text style={styles.buttonText}>Update Profile Details</Text>
				</TouchableHighlight>
				
				<TouchableHighlight
					underlayColor= '#f19292'
					style={styles.button}
					onPress={() => {
						this.props.navigation.navigate('ProfilePhoto',{ 
							id: this.state.id })
				}}>
					<Text style={styles.buttonText}>Change Profile Photo</Text>
				</TouchableHighlight>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center', backgroundColor: '#e1f4f3' },
	text: { color: '#333333', textAlign: 'center', fontSize: 15,  marginTop: 10 },
	textField: { backgroundColor: '#ffffff', height: 50, borderColor: '#706c61',margin: 10, borderWidth: 1 },
	buttonText: {  color: '#706c61',  fontSize: 12 },
	button: { alignItems: 'center',  backgroundColor: '#ffffff', padding: 10, margin: 5, borderRadius: 10 }
});

export default Update
