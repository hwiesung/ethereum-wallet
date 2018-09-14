import React, { Component } from 'react'
import { View,  Button, Text } from 'react-native';
import {firebaseApp} from "../firebase";

export default class CreatePrivateKeyScreen extends Component {

  createWallet(){
    firebaseApp.auth().currentUser.updateProfile({displayName:"Hwiesung"}).then(()=>{
      console.log(firebaseApp.auth().currentUser);
      this.props.navigation.navigate('Home');
    });
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text> Select Your Secret Words </Text>
        <Button title="Done" onPress={()=>this.createWallet()}/>
      </View>
    );
  }
}
