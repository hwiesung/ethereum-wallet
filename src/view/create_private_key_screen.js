import React, { Component } from 'react'
import { View,  Button, Text } from 'react-native';

export default class CreatePrivateKeyScreen extends Component {

  moveHome(){
    this.props.navigation.navigate('Home')
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text> Select Your Secret Words </Text>
        <Button title="Done" onPress={()=>this.moveHome()}/>
      </View>
    );
  }
}
