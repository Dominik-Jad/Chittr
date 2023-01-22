import React, { Component } from 'react';
import { Container } from 'native-base';
import { Text, TextInput, Alert, TouchableHighlight, StyleSheet } from 'react-native';

{/* Posts inputted data to server and checks against stored user's details.
	If present, throw error and alert user email is in use.
	If absent, creates and stores new user on server and navigates to login screen.*/}

class Create extends Component {
	constructor(props){
		super(props);
		this.state ={
			given_name: '',
			family_name: '',
			email: '',
			password: ''
		}
	}

    createAccount(){
		let res = JSON.stringify({
			given_name: this.state.given_name,
			family_name: this.state.family_name,
			email: this.state.email,
			password: this.state.password
		});
		console.log(res);
		return fetch("http://10.0.2.2:3333/api/v0.0.5/user/",
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
				Alert.alert("Account Created, Taking You To Login Screen");
				this.props.navigation.navigate('Login')
			}
			else{
				Alert.alert("Error creating account, email already in use!");
			}
		}).catch((error) => {
			console.log(error);
		});
	}
  
	render(){
		return(
			<Container style={styles.container}>

				<TextInput 
					placeholder='First Name'
					style={styles.textField} 
					placeholderTextColor={'706c61'}
					onChangeText={given_name => this.setState({given_name: given_name})}
				/>

				<TextInput 
					placeholder='Last Name'
					style={styles.textField} 
					placeholderTextColor={'706c61'}
					onChangeText={family_name => this.setState({family_name: family_name})}
				/>
				<TextInput 
					placeholder='Email'
					style={styles.textField} 
					placeholderTextColor={'706c61'}
					onChangeText={email => this.setState({email: email})}
				/>

				<TextInput 
					placeholder='Password'
					style={styles.textField} 
					placeholderTextColor={'706c61'}
					onChangeText={password => this.setState({password: password})}
				/>

				<TouchableHighlight
					underlayColor= '#f19292'
					style={styles.button}
					onPress={() => {
						 this.createAccount(this.state.email,this.state.password);
				}}>
					<Text style={styles.text}>Create account</Text>
				</TouchableHighlight>
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {backgroundColor: '#e1f4f3',justifyContent: 'center'},
	text: {color: '#706c61',fontSize: 20,textAlign: 'center'},
	button: {alignItems: 'center',backgroundColor: '#ffffff', padding: 10, margin: 10, borderRadius: 10},
	textField: {height: 40, borderColor: 'gray', borderWidth: 1,color: '#333333', backgroundColor: '#fff'}
});

export default Create