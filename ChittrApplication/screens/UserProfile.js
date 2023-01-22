import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Button, Alert, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Container} from 'native-base'

{/* getProfile sends GET request to server using retrieved ID, retrieving profile details.
	Token used to verify user is logged in when following a new user.*/}

class UserProfile extends Component {
    constructor(props){
        super(props);
        this.state ={
			given_name: '',
			family_name: '',
			email: '',
			id: '',
			isLoading: true,
			chitData: []
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

	componentDidMount(){
		let id = this.props.route.params.user_id;
		this.setState({id: id})
		this.getProfile(id)
	}

	convertToDate(timestamp){
		console.log(timestamp)
		var date = new Date(timestamp).toString()
		return date
	}

	followUser(){
		this.getToken().then(token =>{ 
			return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' +this.state.id +'/follow/',
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'X-Authorization' : token
				},
			})
			.then((response) => {
				Alert.alert("You Are Now Following This User");
			}).catch((error) => {
				Alert.alert("There Was An Error Following This User, Please Try Again");
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
				let chits = (json)['recent_chits']
		  		this.setState({given_name: fname})
				this.setState({family_name: lname})
				this.setState({isLoading: false})
				this.setState({chitData: chits})
			});
		}).catch((error) => {
			Alert.alert("There Wan An Error Retrieving Account Details, Please Try Again");
			console.error(error);
		});
	}

	render(){  
		return(
			<Container>
				<Container style={styles.container}>
					<Image style={styles.profileImage} source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.id + '/photo/'}}/>
					<Text style={styles.text}>{this.state.given_name} {this.state.family_name}</Text>
					
					<TouchableHighlight
						underlayColor= '#f19292'
						style={styles.button}
						onPress={() => {
							this.props.navigation.navigate('Followers',{
							id: this.state.id
							})
						}}>
						<Text style={styles.text}>Followers</Text>
					</TouchableHighlight>
					
					<TouchableHighlight
						underlayColor= '#f19292'
						style={styles.button}
						onPress={() => {
							this.props.navigation.navigate('Following',{
							id: this.state.id
						})
					}}>
						<Text style={styles.text}>Following</Text>
					</TouchableHighlight>
					
					<TouchableHighlight
						underlayColor= '#f19292'
						style={styles.button}
						onPress={() => {
							this.followUser()
						}}>
						<Text style={styles.text}>Follow This User</Text>
					</TouchableHighlight>
					
					<Text style={styles.infoText}>Scroll To View More Chits</Text>
				</Container>

				<Container>
					<FlatList
						data={this.state.chitData}
						renderItem={
							({item}) => 
							<View style= {styles.chits}>
								<Image style={styles.chitImage} source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/chits/' + item.chit_id + '/photo/'}}/>

								<Text style={styles.chitText}>{item.chit_content}</Text>
							  
								<Text style={styles.subText}>{this.convertToDate(item.timestamp)}</Text>
							</View>
						}
						keyExtractor={({id}) => id}
					/> 
				</Container>
			</Container>
		)  
	}
}

const styles = StyleSheet.create({
	container: {flex: 1,backgroundColor: '#e1f4f3',alignItems: 'center'},
	chits: {flexDirection: "column", alignItems: "center", marginBottom: 5, backgroundColor: '#ffffff'},
	text: {color: '#333333',textAlign: 'center', fontSize: 15},
	infoText: {marginTop: 30, color:'#706c61'},
	chitText: {color:'#333333', textAlign: 'center', fontSize: 15},
	subText: {color:'#706c61', textAlign: 'center', fontSize: 10},
	chitImage: {height: 75,width: 150,justifyContent: 'center',alignItems: 'center'},
	profileImage: {height: 100, width: 100, margin: 5, justifyContent: 'center', alignItems: 'center'},
	button: {alignItems: 'center',backgroundColor: '#ffffff', padding: 10, margin: 5, borderRadius: 10},
});


export default UserProfile