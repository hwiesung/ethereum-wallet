import React, { Component } from 'react'
import { View,  Button, ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import { observer, inject } from 'mobx-react/native'
import { firebaseApp } from '../firebase'
import Toast, {DURATION} from 'react-native-easy-toast'
import LinearGradient from 'react-native-linear-gradient';

@inject("appStore") @observer
export default class GettingStart extends Component {

  constructor() {
    super();
    this.state = {
      isProcessing : true,
      signIn : false
    };
  }
  componentWillMount() {

  }

  componentWillUnmount(){
    console.log('singinPage will unmount');
  }

  moveCreateWallet(){
    console.log(this.props.appStore);
    if(this.state.signIn){
      this.props.navigation.navigate('CreateWallet');
    }
  }


  render() {

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'white' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'white' }}>
          <Text style={{fontSize:30, color:'black', fontWeight:'bold'}}>ComEx Wallet</Text>
          <Text style={{marginTop:4, marginBottom:24, fontSize:20}}>Welcome to ComEx !!</Text>
          <View style={{backgroundColor:'red', height:202, width:324, borderRadius:12}}/>
        </View>
        <TouchableOpacity onPress={()=>this.moveCreateWallet()}>
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#5da7dc', '#306eb6']} style={{justifyContent: 'center',alignItems: 'center', borderRadius:12, marginBottom:38, backgroundColor:'rgb(48,110,182)',  width:330, height:58}}>
          <Text style={{color:'white', fontSize:20, fontWeight:'bold'}} >Getting Start</Text>
        </LinearGradient>
      </TouchableOpacity>
      </View>

    );
  }
}
