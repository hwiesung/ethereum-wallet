import React, { Component } from 'react'
import { View,  Button, ActivityIndicator, Text, Image, TouchableOpacity} from 'react-native';
import { observer, inject } from 'mobx-react/native'
import { firebaseApp } from '../firebase'
import Toast, {DURATION} from 'react-native-easy-toast'
const rgbHex = require('rgb-hex');
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash'


@inject("appStore") @observer
export default class CompleteWallet extends Component {

  constructor() {
    super();
    this.state = {
      isProcessing : false,
      requestSingIn : false
    };
  }


  moveToHome(){
    this.props.navigation.navigate('Home');
  }


  render() {
    let msg = this.props.navigation.getParam('msg','');

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'white' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{fontSize:22, fontWeight:'bold', color:'black', marginTop:98}}>{msg}</Text>
          <View style={{backgroundColor:'red', height:202, width:324, marginTop:70, borderRadius:12}}/>
        </View>

        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#5da7dc', '#306eb6']} style={{justifyContent: 'center',alignItems: 'center', borderRadius:12, marginBottom:38, backgroundColor:'rgb(48,110,182)',  width:330, height:58}}>
          <Text style={{color:'white', fontSize:20, fontWeight:'bold'}} onPress={()=>this.moveToHome()}>Start</Text>
        </LinearGradient>

      </View>
    );
  }
}
