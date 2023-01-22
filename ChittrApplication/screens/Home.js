import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { Container,Body,Text } from 'native-base';

{/* TouchableHighlights used so button presses are more clearly displayed to user */}
class Home extends Component {

	render(){
		return(
			<Container style={styles.container}>
				<Text style={styles.titleText}>Chittr</Text>

				<Text style={styles.text}>Login or register to get started!</Text>
				<Body style={{marginTop: 200}}>
					<TouchableHighlight
						underlayColor= '#f19292'
						style={styles.button} 
						onPress={() => {
							this.props.navigation.navigate('Login')
						}
					}>
						<Text style={styles.text}>Login</Text>
					</TouchableHighlight>
					
					<TouchableHighlight
						 underlayColor= '#f19292'
						 style={styles.button}
						 onPress={() => {
							 this.props.navigation.navigate('Create')
						 }
					}>
						<Text style={styles.text}>Register</Text>
					</TouchableHighlight>
				</Body>
			</Container>
		);
  }
}

{/* creates stylesheet for component stylising */}
const styles = StyleSheet.create({
	container: {flex: 1,backgroundColor: '#e1f4f3',justifyContent: 'center', flexDirection: 'column'},
	titleText: {color: '#333333',textAlign: 'center',fontSize: 40,marginTop: 150},
	text: {color: '#706c61',textAlign: 'center',fontSize: 15},
	button: {alignItems: 'center',backgroundColor: '#ffffff', padding: 10, margin: 10, borderRadius: 10}
});

{/* exports class */}
export default Home