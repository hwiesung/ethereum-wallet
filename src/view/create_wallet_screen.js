import React, { Component } from 'react'
import { View,  Button } from 'react-native';

export default class CreateWalletScreen extends Component {

  moveHome(){
    this.props.navigation.navigate('Secret')
  }

  render() {
    console.log(this.props.navigation);
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Create Wallet!" onPress={()=>this.moveHome()}/>
      </View>
    );
  }
}
