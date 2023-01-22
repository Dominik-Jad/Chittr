import React, { Component } from 'react';
import { TextInput, StyleSheet, Alert, TouchableHighlight } from 'react-native';
import { Container,Body,Text,Header } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

{/* Posts inputted data to server and checks against stored user's details. 
	If present, token is retrieved and stored asynchronously and user continues to Chit dashboard.
	If absent, throw error and alert user*/}

class Login extends Component {
	constructor(props){
		super(props)
		{/* set states */}
		this.state ={
			email: '',
			password: ''
		}
    }
	
    login(email,password){
		let res = JSON.stringify({
			email: email,
			password: password
		});
		console.log(res);
		return fetch("http://10.0.2.2:3333/api/v0.0.5/login/",
		{
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: res
		})
	
		.then((response) => {
			if(response.ok){
				response.json().then(json => {
					let token = (json)['token']
					console.log("Token is!: " + token)
					let id = (json)['id']
					this.storeDetails(token,id)
				});
				this.props.navigation.navigate('Chits')
			}
			else{
				Alert.alert("Error Logging In. Please Check Your Details And Try Again")
				throw new Error('Login Error')
			}
		}).catch((error) => {
			console.log(error)
			throw new Error('Error Logging In')
		});
	}

	async storeDetails(token,id,password){
		try {
			await AsyncStorage.setItem('token', token)
			await AsyncStorage.setItem('id', id.toString())
			await AsyncStorage.setItem('password',this.state.password)
		} catch (e) {
			console.error(e)
		}
    }
  
    render(){
		return(
			<Container style={styles.container}>
				<Container style={styles.loginContainer}>
					<TextInput 
						placeholder='Email'
						style={styles.textField} 
						placeholderTextColor={'706c61'}
						onChangeText={email => this.setState({email: email})}
					/>

					<TextInput 
						placeholder='Password'
						secureTextEntry
						style={styles.textField}
						placeholderTextColor={'706c61'}
						onChangeText={password => this.setState({password: password})}
					/>
				  
					<TouchableHighlight
						underlayColor= '#f19292'
						style={styles.button}
						onPress={() => {
							this.login(this.state.email,this.state.password);
					}}>
						<Text style={styles.text}>Login</Text>
					</TouchableHighlight>
				</Container>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {backgroundColor: '#e1f4f3',justifyContent: 'center'},
	loginContainer: {marginTop: 0,backgroundColor: '#e1f4f3',justifyContent: 'center'},
	text: {color: '#706c61',fontSize: 20,textAlign: 'center'},
	button: {alignItems: 'center',backgroundColor: '#ffffff', padding: 10, margin: 10, borderRadius: 10},
	textField: {height: 40, borderColor: 'gray', borderWidth: 1,color: '#333333', backgroundColor: '#fff'}
});

export default Login