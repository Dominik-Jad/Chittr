import React, { Component } from 'react';
import { TextInput, View, Image, FlatList, Text, Alert, TouchableHighlight, StyleSheet } from 'react-native';
import { Container } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

{/* search uses inputted search-bar data as content in finding related users.
	*/}

class Search extends Component {
	constructor(props){
		super(props)
		this.state ={
			content: '',
			hasSearched: false,
			searchData: [],
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
	
	search(){
		return fetch("http://10.0.2.2:3333/api/v0.0.5/search_user?q=" + this.state.content)
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.length == 0){
				Alert.alert("No Results Were Found, Please Try Again")
			}  
			else{
				this.setState({
					hasSearched: true,
					searchData: responseJson,
			});
		  }
		})
		.catch((error) =>{
		  console.log(error);
		})
	}

	render(){
		if(this.state.hasSearched == true && this.state.searchData.length != 0){
			return(
			<Container style={styles.container}>
				<View>
					<TextInput style={styles.textField} onChangeText={content => this.setState({content: content})} placeholder='Enter Search Term Here'/>
					
					<TouchableHighlight
						underlayColor= '#f19292'
						style={styles.button}
						onPress={() => {
							this.setState({
							hasSearched: true
							})
						this.search()
						}}>
						<Text style={styles.text}>Search</Text>
					</TouchableHighlight>
			
					<FlatList
						data={this.state.searchData}
						renderItem={
						({item}) => 
							<View style= {styles.container}>

								<Image 
									style={styles.image}
									source={{uri: 'http://10.0.2.2:3333/api/v0.0.5/user/' + item.user_id + '/photo/'}}
								/>
								<TouchableHighlight 
									underlayColor= '#f19292'
									onPress={() =>{this.profileNavigate(item.user_id)}}
									style= {styles.button}
								>
									<Text style={styles.text}> {item.given_name} {item.family_name}  </Text>
								</TouchableHighlight>
							</View>
				  }
				  keyExtractor={({id}) => id}
				/> 
				</View>
				</Container>
			)
		}

		return(
		<Container style={styles.container}>
			<View>
				<TextInput style={styles.textField} onChangeText={content => this.setState({content: content})} placeholder='Enter Search Term Here'/>
				
				<TouchableHighlight
					underlayColor= '#f19292'
					style={styles.button}
					onPress={() => {
						this.setState({
						hasSearched: true
						})
					this.search()
				}}>
					<Text style={styles.text}>Search</Text>
				</TouchableHighlight>
			</View>
		</Container>
		);  
  }
}

const styles = StyleSheet.create({
	container: {flex: 1,backgroundColor: '#e1f4f3',alignItems: 'center', flexDirection: "column", marginBottom: 5},
	text: {color: '#706c61',textAlign: 'center',fontSize: 15},
	button: {alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 10},
	textField: {height: 40, borderColor: 'gray', borderWidth: 1,color: '#333333', backgroundColor: '#ffffff'},
	image: {height: 75, width: 75, justifyContent: 'center', alignItems: 'center', margin: 5}
});

export default Search