import React, { Component } from 'react';
import { TextInput, FlatList, StyleSheet, ActivityIndicator, Text, View, Alert, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

{/* RNFS used to enable reading and writing of files on server.
	readDraft retrieves saved drafts from server and allows them to be displayed in FlatList. If contents are empty, return error and alert user.
	deleteDraft updates selected draft value to be null, and therefore deletes.
	updateDraft updates selected draft value to be equal to the inputted data.
	saveDraft writes drafted chit into drafts.txt file stored on server, to be retrieved by readDraft.
	*/}

var RNFS = require('react-native-fs');

class Drafts extends Component {
	constructor(props){
		super(props);
		this.state ={
			isLoading: true,
			drafts: [],
			currentDraft: '',
			content: '',
			index: 0
		}
	}

	readDraft(){
		RNFS.readDir(RNFS.DocumentDirectoryPath +"/config/")
		.then((result) => {
			console.log('GOT RESULT', result);
			return Promise.all([RNFS.stat(result[0].path), result[0].path]);
		})
		.then((statResult) => {
			if (statResult[0].isFile()) {
			return RNFS.readFile(statResult[1], 'utf8');
		}
		return 'no file';
		})
		.then((contents) => {  
		if(contents == ''){
			Alert.alert("Save A Chit As A Draft To See It Here!")
        this.props.navigation.navigate("Post")
		}
		this.setState({drafts : contents.split("\n")})
		this.setState({isLoading: false})
		}).catch((err) => {
			console.log(err.message)
		});
	}  

	deleteDraft(index){
		var currentDrafts = this.state.drafts
		currentDrafts.splice(index,1)
		var newDrafts = ''
		for(var i = 0; i < currentDrafts.length; i++){
			if(i == 0){
				newDrafts += currentDrafts[i]
			}
			else{
				newDrafts += "\n"  + currentDrafts[i]
			}
		}
		this.saveDraft(newDrafts)
		this.readDraft()
	}

	updateDraft(){
		var currentDrafts = this.state.drafts
		currentDrafts.splice(this.state.index)
		currentDrafts.push(this.state.content)
		var newDrafts = ''
		for(var i = 0; i < currentDrafts.length; i++){
			if(i == 0){
				newDrafts += currentDrafts[i]
			}
			else{
				newDrafts += "\n"  + currentDrafts[i]
			}
		}
		this.saveDraft(newDrafts)
		this.readDraft()
	}

	saveDraft(draft){
		var path = RNFS.DocumentDirectoryPath + '/config/drafts.txt';
		console.log(draft)
		RNFS.writeFile(path, draft, 'utf8')
		.then((success) => {
			Alert.alert("Drafted Chit(s) Updated")
		}).catch((err) => {
			console.log(err.message);
		});
	}

	componentDidMount(){
		this.readDraft()
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
			<View style = {{flex: 1}}> 
			<TextInput style={styles.textField} defaultValue = {this.state.currentDraft} onChangeText={content => this.setState({content: content})}/>
			<FlatList
				data={this.state.drafts}
				renderItem={
					({item,index}) => 
					<View style={styles.container}>
					<Text style={styles.text}>{item}</Text>
						<TouchableHighlight
							underlayColor= '#f19292'
							style={styles.button}
							onPress={() => {
								this.setState({currentDraft : item})
								this.setState({index: index})    
							}}>
							<Text>Edit Draft</Text>
						</TouchableHighlight>

						<TouchableHighlight
							underlayColor= '#f19292'
							style={styles.button}
							onPress={() => {
								this.deleteDraft(index)    
							}}>
							<Text>Remove Draft</Text>
						</TouchableHighlight>
						
						<TouchableHighlight
							underlayColor= '#f19292'
							style={styles.button}
							onPress={() => {
								this.updateDraft()
							}}>
							<Text>Update Draft</Text>
						</TouchableHighlight>
					</View>
				}
				keyExtractor={(item, index) => index.toString()}
			/> 
		</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {flex: 1,backgroundColor: '#e1f4f3',alignItems: "center", flexDirection: 'column', marginBottom: 5},
	text: {color: '#706c61',textAlign: 'center',fontSize: 15},
	button: {alignItems: 'center',backgroundColor: '#ffffff', padding: 10, margin: 5, borderRadius: 10},
	textField:{height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: '#ffffff' }
});

export default Drafts