import React, { Component } from 'react';
import {  View, Alert, TextInput, PermissionsAndroid, Switch, TouchableHighlight, Text, StyleSheet} from 'react-native';
import Geolocation, { watchPosition } from 'react-native-geolocation-service'
import { ForceTouchGestureHandler } from 'react-native-gesture-handler';
import BackgroundTask from 'react-native-background-task'
import AsyncStorage from '@react-native-community/async-storage';

{/* RNFS used to enable reading and writing of files on server.
	BackgroundTask posts Chit to server, alongside timestamp and location data.
	saveDraft saves inputted Chit as a draft.
	requestLocationPermission asks the user if they will allow the app to access their location through a message.
	makeDirectory creates configs to store drafts.
	Post retrieves ID, token and location. It then posts chit contents alongside timestamp and location data*/}

var RNFS = require('react-native-fs');

BackgroundTask.define(() => {
	console.log("Running")
	let date =  Date.now();

	let res = JSON.stringify({
		timestamp: date,
		chit_content: this.state.content,
		'location' : {
		longitude: this.state.long,
		latitude: this.state.lat
		}
	});

	console.log(res)
		this.getToken().then((token) =>{
			return fetch('http://10.0.2.2:3333/api/v0.0.5/chits/',
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-Authorization' : token
				},
				body: res
			})
			.then((response) => {
				response.json().then(json => {
			})
			}).catch((error) => {
				console.error(error);
			});
		})
	BackgroundTask.finish()
})

async function requestLocationPermission(){
	try {
		const granted = await PermissionsAndroid.request(
		PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
		{
			message:'This app requires access to your location.',
			buttonNegative: 'Deny',
			buttonPositive: 'Allow',
		},
		);
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			this.setState({locationEnabled: true})
			console.log('Location permission granted');
			return true;
		} else {
			console.log('Location permission denied');
			return false;
		}
	} catch (err) {
		console.warn(err);
	}
}

class Post extends Component {
	constructor(props){
		super(props);
		this.state ={
			timestamp: 0,
			long: 0,
			lat: 0,
			switchValue: false,
			draft: false,
			isPhoto: false,
			locationEnabled: false,
			content: '',
			drafts: '',
			chit_id: ''
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
	
	async getLocation(){
		if(!this.state.locationEnabled){
			this.state.locationEnabled = requestLocationPermission();
		}
		Geolocation.getCurrentPosition((position) =>{
			let json = position
			this.setState({lat :  json.coords.latitude})
			this.setState({long :  json.coords.longitude})
			this.post()
		},
		(error) =>{
			Alert.alert(error.message)
		},
		{
			timeout: 20000,
		}
		)
	}
	
	toggleLocation = (value) => {
		this.setState({switchValue: value})
		this.setState({locationEnabled: value})
	}
	
	componentDidMount(){
		requestLocationPermission()
		this.makeDirectory()
	}

	makeDirectory = () => {
		RNFS.mkdir(RNFS.DocumentDirectoryPath+"/config/")
		.then((result) => {
			console.log('result', result)
		}).catch((err) => {
			console.warn('error', err)
		})
	}

	readDraft(){
		RNFS.readDir(RNFS.DocumentDirectoryPath + "/config/")
		.then((result) => {
		console.log('Result:', result);

		return Promise.all([RNFS.stat(result[0].path), result[0].path]);
		})
		.then((statResult) => {
			if (statResult[0].isFile()) {
			return RNFS.readFile(statResult[1], 'utf8');
			}
			else{
				console.log("empty")
			}
		return 'No file found';
		})
		.then((contents) => {
			if(contents == ''){
				this.saveDraft(this.state.content)
			}
			else{
				var currentDraft = this.state.content
				var finalDrafts = contents += "\n" + currentDraft
				this.saveDraft(finalDrafts)
			}
		}).catch((err) => {
			this.saveDraft(this.state.content)
		});
	}  
	
	saveDraft(storedDrafts){
		var path = RNFS.DocumentDirectoryPath + '/config/drafts.txt';
		RNFS.writeFile(path, storedDrafts, 'utf8')
		.then((success) => {
			console.log('File written');
		}).catch((err) => {
			console.log(err.message);
		});
	}

	post(){
		let text = this.state.content
		if(text.length > 141){
			Alert.alert("There is a character limit on Chits of 141. Your Chit was" + text.length + " long, please reduce it.")
			throw new Error('Length > 141')
		}else{
			let date =  Date.now();
			let res = JSON.stringify({
				timestamp: date,
				chit_content: this.state.content,
				'location' : {
					longitude: this.state.long,
					latitude: this.state.lat
				}
			});
			console.log(res);
			this.getToken().then((token) =>{
				return fetch('http://10.0.2.2:3333/api/v0.0.5/chits/',
				{
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						'X-Authorization' : token
					},
					body: res
				})
				.then((response) => {
					if(response.ok){
						Alert.alert("Chit Successfully Posted")
						response.json().then(json => {
							if(this.state.isPhoto == true){
								let id = (json)['chit_id']
								this.props.navigation.navigate('Photo',{
								chit_id : id
								})
							}
							else{
								this.props.navigation.navigate('Chits')
							}
						})
					}
					else{
						Alert.alert("There was an error posting your chit. Please try again.")
					}
				}).catch((error) => {
					console.log(error);
				});
			})
		} 
	}


	render(){
		return(
			<View style ={styles.container}>
				<TextInput style={styles.textField} 
					placeholder = 'Enter Chit Here...'
					placeholderTextColor={'706c61'}
					onChangeText={content => this.setState({content: content})}
				/>
				<TouchableHighlight
					underlayColor= '#f19292'
					style={styles.button}
					onPress={() => {
						if(this.state.locationEnabled == true){
							console.log("location enabled and using location")
							this.getLocation()
						}
						else{
							this.post()
						}
					}}>
						<Text>Chit</Text>
				</TouchableHighlight>
				
				<TouchableHighlight
					underlayColor= '#f19292'
					style={styles.button}
					onPress={() => {
						this.setState({isPhoto : true})
						if(this.state.locationEnabled == true){
							this.getLocation()
						}
						else{
							this.post()
						}
					}}>
					<Text>Add An Image To Your Current Chit</Text>
				</TouchableHighlight>
				
				<TouchableHighlight
					underlayColor= '#f19292'
					style={styles.button}
					onPress={() => {
					this.readDraft()
					Alert.alert("Draft Saved")
				}}>
					<Text>Save Your Chit As A Draft</Text>
				</TouchableHighlight>
					
				<TouchableHighlight
					underlayColor= '#f19292'
					style={styles.button}
					onPress={() => {
						this.props.navigation.navigate('Drafts')
				}}>
					<Text>View Drafted Chits</Text>
				</TouchableHighlight>
	
				<Switch 
					onValueChange = {this.toggleLocation}
					value = {this.state.switchValue}/>   
				<Text style = {styles.titleText}>Toggle Location On/Off With Switch --> </Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {flex: 1,backgroundColor: '#e1f4f3', flexDirection: 'column'},
	titleText: {color: '#706c61', margin: 5},
	button: {alignItems: 'center',backgroundColor: '#ffffff', padding: 10, margin: 5, borderRadius: 10},
	textField:{height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: '#ffffff' }
});

export default Post