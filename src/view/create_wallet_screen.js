import React, { Component } from 'react'
import { View,  Button, ActivityIndicator, Text, Image, TouchableOpacity} from 'react-native';
import { observer, inject } from 'mobx-react/native'
import { firebaseApp } from '../firebase'
import Toast, {DURATION} from 'react-native-easy-toast'
const rgbHex = require('rgb-hex');
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash'

@inject("appStore") @observer
export default class CreateWalletScreen extends Component {

  constructor() {
    super();
    this.state = {
      isProcessing : false,
      requestSingIn : false
    };
  }

  createWallet(){
    this.props.navigation.navigate('BackupWallet');
  }


  moveToFindWallet(){
    this.props.navigation.navigate('FindWallet');
  }


  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'white' }}>
        {(!this.state.isProcessing)?(<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#5da7dc', '#306eb6']} style={{justifyContent: 'center',alignItems: 'center', backgroundColor:'red', height:202, width:324, borderRadius:12}} >
          <TouchableOpacity style={{justifyContent: 'center',alignItems: 'center'}} onPress={()=>this.createWallet()}>
            <Image source={require('../../assets/btnCommonPlus44Pt.png')}/>
            <Text style={{marginTop:11, color:'white', fontSize:20, fontWeight:'bold'}}>Create new wallet</Text>
          </TouchableOpacity>
        </LinearGradient>):null}

        <Text style={{marginTop:67, fontSize:16, color:'rgb(47,109,182)', textDecorationLine: 'underline'}} onPress={()=>this.moveToFindWallet()}>Already have Wallet</Text>
        {(this.state.isProcessing)?(<ActivityIndicator/>):null}
        <Toast ref="toast"/>
      </View>
    );
  }
}
