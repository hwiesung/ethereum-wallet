import React, { Component } from 'react'
import { View, Text } from 'react-native';
import DefaultPreference from 'react-native-default-preference';

export default class WalletScreen extends Component {
  constructor() {
    super();
    this.state = {
      isProcessing : false
    };
  }

  componentDidMount(){
    console.log(DefaultPreference.get('privateKey').then((value)=>{
      console.log(value);
    }));
  }


  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>My wallet List</Text>
      </View>
    );
  }
}
