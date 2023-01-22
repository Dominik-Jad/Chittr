import React, { Component } from 'react';
import { Image,FlatList, ActivityIndicator, Text, View, StyleSheet,TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Footer } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

{/* profileNavigate navigates to user's profile on press using their ID (retrieved from async storage with getID).
	getChits returns chits from server.
	TouchableOpacity used when button contains both image and text.
	keyExtractor tells flatList to use ids for react keys instead of default key property
	*/}

class Chits extends Component {
	constructor(props){
		super(props);
		this.state ={
		isLoading: true,
		chitData: []
		}
	}

	profileNavigate(user_id){
		this.getID().then((id) =>{
			if(id == user_id || user_id == -1){
				{this.props.navigation.navigate('MyProfile',{
				user_id: id
				})}
			}else{
				this.props.navigation.navigate('UserProfile',{
				user_id: user_id
				})
			}
		})
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

	getChits(){
		return fetch("http://10.0.2.2:3333/api/v0.0.5/chits/")
		.then((response) => response.json())
		.then((responseJson) => {

		this.setState({
			isLoading: false,
			chitData: responseJson,
			});
		})
		.catch((error) =>{
			console.log(error);
		});
	}

	convertToDate(timestamp){
		console.log(timestamp)
		var date = new Date(timestamp).toString()
		return date
	}

	componentDidMount(){
		this.getChits();
	}
	
	render(){
		if(this.state.isLoading){
		  return(
		  <View>
			<ActivityIndicator/>
		  </View>
		  )
		}

		return(
			<Container style = {styles.container}> 
				<FlatList 
					data={this.state.chitData}
					renderItem={({item}) => 
					<TouchableOpacity 
						onPress={() =>{this.profileNavigate(item.user.user_id)}}
						style= {styles.feedItems}
					>
						<Image style={styles.image} source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/chits/' + item.chit_id + '/photo/'}}/>
						<Text style={styles.text}>{item.chit_content}</Text>
						<Text style={styles.subText}>{item.user.given_name} {item.user.family_name}</Text>
						<Text style={styles.subText}>{this.convertToDate(item.timestamp)}</Text> 
					</TouchableOpacity>
					}
					keyExtractor={({id}) => id}
				/> 

				<Footer style={styles.footer}>
					<TouchableHighlight
						underlayColor= '#f19292'
						style={styles.button}
						onPress={() => {
							 this.props.navigation.navigate('Post')
					}}>
						<Text style={styles.buttonText}>Send Chit</Text>
					</TouchableHighlight>
					
					<TouchableHighlight
						underlayColor= '#f19292'
						style={styles.button}
						onPress={() => {
							 this.props.navigation.navigate('Search')
					}}>
						<Text style={styles.buttonText}>Search</Text>
					</TouchableHighlight>
					
					<TouchableHighlight
						underlayColor= '#f19292'
						style={styles.button}
						onPress={() => {
							 this.profileNavigate(-1)
					}}>
						<Text style={styles.buttonText}>Profile</Text>
					</TouchableHighlight>
				</Footer>  
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {flex: 1,backgroundColor: '#706c61'},
	text: {color:'#333333', textAlign: 'center'},
	subText: {color: '#706c61',fontSize: 10,textAlign: 'center'},
	image: {height: 100,width: '100%', borderRadius: 5},
	footer: {height: 30,backgroundColor: '#706c61'},
	button: {alignItems: 'center',backgroundColor: '#ffffff', padding: 8, marginRight: 15, borderRadius: 10},
	buttonText: {color: '#706c61',fontSize: 18,textAlign: 'center'},
	feedItems: {flexDirection: "column", marginBottom: 2, backgroundColor: '#e1f4f3'}
});

export default Chits