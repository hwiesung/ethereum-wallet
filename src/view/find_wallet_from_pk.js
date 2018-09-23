import React, { Component } from 'react'
import { View,  Button, Text, TextInput } from 'react-native';
import {firebaseApp} from "../firebase";

export default class FindWalletFromPrivateKey extends Component {

  constructor(props) {
    super(props);
    this.state = { words: 'input' };
  }

  findWallet(){

  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text> Private Key </Text>
        <TextInput style={{height:40, width:300,borderColor:'gray', borderWidth:1}}
          onChangeText={(text)=>this.setState({text})} />
        <Button title="Done" onPress={()=>this.findWallet()}/>
      </View>
    );
  }
}
