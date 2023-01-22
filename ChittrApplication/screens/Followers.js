import React, { Component } from 'react';
import { FlatList, ActivityIndicator, StyleSheet, Text,  TouchableHighlight, View} from 'react-native';
import { Container } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

class Followers extends Component {
	constructor(props){
		super(props);
		this.state ={
			isLoading: true,
			followers: [],
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

	getFollowers(id){
		let url = "http://10.0.2.2:3333/api/v0.0.5/user/" +id+"/followers/"
		console.log(url)
		return fetch(url)
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({
				isLoading: false,
				followers: responseJson,
			});
		})
		.catch((error) =>{
			console.log(error);
		});
	}

	componentDidMount(){
		let id = this.props.route.params.id;
		console.log(id);
		this.getFollowers(id)
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
			<Container style={styles.container}>
				<FlatList
					data={this.state.followers}
					renderItem={
					({item}) => 
					<TouchableHighlight 
						underlayColor= '#f19292'
							onPress={() =>{this.profileNavigate(item.user_id)}}
							style= {styles.button}
					>
						<Text style={styles.text}> {item.given_name} {item.family_name}  </Text>
					</TouchableHighlight>
					}
					keyExtractor={({id}, index) => id}
				/> 
			</Container>
		);
	}
}

const styles = StyleSheet.create({
	container: {flex: 1,backgroundColor: '#e1f4f3'},
	text: {color: '#333333',textAlign: 'center',fontSize: 25,marginTop: 10},
	image: {height: 75,width: 75,justifyContent: 'center',alignItems: 'center'},
	button: {flexDirection: "column", alignItems: "center", marginBottom: 5, backgroundColor: '#ffffff', borderRadius: 10}
});

export default Followers