import React, { Component } from 'react';
import { StyleSheet,FlatList, ActivityIndicator, Text, View, TouchableHighlight } from 'react-native';
import { Container,Button } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

{/* removeFollow uses getID to unfollow a specific user. Also uses getToken to verify user has permissions to unfollow a user.
	*/}

class Following extends Component {
	constructor(props){
		super(props);
		this.state ={
			isLoading: true,
			following: [],
			user_id: -1
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

	removeFollow(id){
		this.getToken().then((token) =>{
			let url = "http://10.0.2.2:3333/api/v0.0.5/user/" +id+"/follow/"
			console.log(url)
			return fetch(url,{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'X-Authorization' : token
				},
			})
			.then((response) => response.json())
			.then((responseJson) => {
				this.setState({
				isLoading: false,
				following: responseJson,
				});
			})  .catch((error) =>{
					console.log(error);
			});
		})
	}

	getFollowing(id){
		let url = "http://10.0.2.2:3333/api/v0.0.5/user/" +id+"/following/"
		console.log(url)
		return fetch(url)
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({
				isLoading: false,
				following: responseJson,
			});
		})
		.catch((error) =>{
			console.log(error);
		});
	}

	componentDidMount(){
		let id = this.props.route.params.id;
		console.log(id);
		this.getFollowing(id)
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
			<Container style ={styles.container}> 
				<FlatList
					data={this.state.following}
					renderItem={({item}) => 
						<View style={{flexDirection: 'row'}}>
							
							<TouchableHighlight 
								underlayColor= '#f19292'
								onPress={() =>{this.profileNavigate(item.user_id)}}
								style= {styles.button}
							>
								<Text style={styles.text}> {item.given_name} {item.family_name}  </Text>
							</TouchableHighlight>
							
							<TouchableHighlight style ={styles.button}
							underlayColor= '#f19292'
							onPress={() => {
								this.removeFollow(item.user_id);
							}}>
								<Text style={styles.text}> Unfollow </Text>
							</TouchableHighlight>
						</View>
					}
					keyExtractor={({id}, index) => id}
				/> 
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {flex: 1,backgroundColor: '#e1f4f3',justifyContent: 'center',alignItems: 'center'},
	text: {color: '#333333',textAlign: 'center',fontSize: 15,marginTop: 10},
	button: {alignItems: 'center', marginLeft: 10, backgroundColor: '#ffffff', borderRadius: 10}
});

export default Following