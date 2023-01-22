import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-community/async-storage';

class ProfilePhoto extends Component {
	constructor(props){
		super(props);
	}

	render() {
		return (
			<View style={styles.container}>
			<RNCamera ref={ref => {
				this.camera = ref;
			}}
			style={styles.image}
			/>
				<View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
					<TouchableOpacity
						onPress={this.takePicture.bind(this)}
						style={styles.button}>
						<Text style={styles.text}>Take Photo</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	postPhoto(uri){
		this.getToken().then((token) =>{
			return fetch('http://10.0.2.2:3333/api/v0.0.5/user/photo',
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/octet-stream',
					'X-Authorization' : token
				},
				body: uri
			})
			.then((response) => {
				if(response.ok){
					Alert.alert("Image Uploaded Successfully")
					this.props.navigation.navigate('Profile')
				}
				else{
					Alert.alert("Image Failed To Be Uploaded, Please Try Again")
				}
			}).catch((error) => {
				console.log(error);
			});
		})
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
  

	takePicture = async() => {
		if (this.camera) {
			const options = { quality: 0.5, base64: true };
			const data = await this.camera.takePictureAsync(options);
			console.log(data.uri);
			this.postPhoto(data)
		}};
}

const styles = StyleSheet.create({
	container: { flex: 1, flexDirection: 'column'},
    image: { flex: 1, justifyContent: 'flex-end', alignItems: 'center'},
    button: { flex: 0, borderRadius: 5, padding: 15, paddingHorizontal: 20, alignSelf: 'center', margin: 20, borderRadius: 10},
});

export default ProfilePhoto