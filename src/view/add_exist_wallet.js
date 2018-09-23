import React, { Component } from 'react'
import { View,  Button, Text, TextInput } from 'react-native';


export default class AddExistWallet extends Component {

  constructor(props) {
    super(props);
    this.state = { words: 'input' };
  }

  importFromPrivateKey(){
    this.props.navigation.navigate('FindWalletPrivateKey');
  }

  importFromSecretWords(){
    this.props.navigation.navigate('FindWalletWords');
  }


  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text> Add ETH Wallet </Text>

        <Button title="Private Key" onPress={()=>this.importFromPrivateKey()}/>
        <Button title="12 Words" onPress={()=>this.importFromSecretWords()}/>
      </View>
    );
  }
}
