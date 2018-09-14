import React, { Component } from 'react'
import { View,  Button } from 'react-native';
import { observer, inject } from 'mobx-react/native'
import { firebaseApp } from '../firebase'

@inject("appStore") @observer
export default class CreateWalletScreen extends Component {

  componentDidMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user.uid);
        this.props.appStore.init(user.uid);
        console.log(firebaseApp.auth().currentUser);
      }
      else{
        console.log('not user');
      }

    });
  }
  moveHome(){

    this.props.navigation.navigate('Secret')
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Create Wallet!" onPress={()=>this.moveHome()}/>
      </View>
    );
  }
}
