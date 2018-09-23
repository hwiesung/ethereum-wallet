import React, { Component } from 'react'
import { View,  Button, Text, TextInput } from 'react-native';
import {firebaseApp} from "../firebase";
import Textarea from 'react-native-textarea';
export default class FindWalletFromWords extends Component {

  constructor(props) {
    super(props);
    this.state = { words: 'input' };
  }

  findWallet(){

  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text> 12 words </Text>
        <Textarea maxLength={120} style={{height:170, width:300, borderColor:'gray', borderWidth:1}}
                   onChangeText={(text)=>this.setState({text})} />
        <Button title="Done" onPress={()=>this.findWallet()}/>
      </View>
    );
  }
}
