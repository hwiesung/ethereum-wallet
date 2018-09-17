import React, { Component } from 'react'
import { View,  Button, Text, TextInput } from 'react-native';
import {firebaseApp} from "../firebase";

export default class FindWallet extends Component {

  constructor(props) {
    super(props);
    this.state = { words: 'input' };
  }

  findWallet(){

  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text> Input Your Secret Words </Text>
        <TextInput style={{flex:1,height:40, borderColor:'gray', borderWidth:1}}
          onChangeText={(text)=>this.setState({text})} />
        <Button title="Done" onPress={()=>this.findWallet()}/>
      </View>
    );
  }
}
