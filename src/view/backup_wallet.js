import React, { Component } from 'react'
import { View,  Button, Text, ActivityIndicator, TouchableOpacity } from 'react-native';

import axios from 'axios';
import { observer, inject } from 'mobx-react/native'
import { action } from 'mobx'
import LinearGradient from 'react-native-linear-gradient';
import DefaultPreference from "react-native-default-preference";



const instance = axios.create({
  baseURL: 'https://us-central1-sonder-6287a.cloudfunctions.net/',
  timeout: 5000,
  headers: {'Content-Type':'application/json'}
});


@inject("appStore") @observer
export default class BackupWallet extends Component {

  constructor() {
    super();
    this.state = {
      agree : false,
      isProcessing:false
    };
  }


  moveToBackup(){
    if(this.state.agree){
      this.props.navigation.navigate('Secret');
    }
  }

  createWallet(){
    let address = '';
    let privateKey = '';
    this.setState({isProcessing:true});
    instance.post('create_wallet', {backupYn:true}).then( (result)=>{
      console.log(result.data);
      address = result.data.address;
      privateKey = result.data.privateKey;
      return DefaultPreference.set('privateKey', privateKey);
    })
      .then(()=>{
        console.log('pk saved');
        this.props.appStore.saveWallet(address, '','', privateKey, this.walletCrated);
      })
      .catch((err)=>{
      console.log(err);
    });
  }

  clickAgree(){
    this.setState({agree:!this.state.agree});
  }

  @action.bound
  walletCrated(){
    console.log('wallet created!!!');
    this.setState({isProcessing:true});
    this.props.navigation.navigate('CompleteWallet', {msg:'Wallet created!'});
  }


  render() {

    let btnColor = (this.state.agree)? ['#5da7dc', '#306eb6']: ['#dbdbdb','#b5b5b5'];
    let checkBackground = (this.state.agree)?'blue':'white';
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor:'white'}}>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'white' }}>
          <Text style={{marginTop:98, fontSize:22, color:'black', fontWeight:'bold'}}>Backup Your account</Text>
          <Text style={{marginTop:20, marginLeft:26, marginRight:26, fontSize:16, textAlign:'center', color:'rgb(155,155,155)'}}> These 12 words are the only way to restore your Trust wallet. save them somewhere safe and secret</Text>

        </View>

        {(!this.state.isProcessing)?(<TouchableOpacity style={{ flexDirection:'row', marginBottom:21}} onPress={()=>this.clickAgree()}>
          <View style={{width:26, height:26, borderWidth:2, marginTop:4, backgroundColor:checkBackground, borderColor:'rgb(48,110,182)'}}/>
          <Text style={{width:280, marginLeft:14, fontSize:14, color:'black' }}>I understand that if I lose my secret phrase, I will not be able to access my account.</Text>
        </TouchableOpacity>):null}

        {(!this.state.isProcessing)?(<TouchableOpacity onPress={()=>this.moveToBackup()}><LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={btnColor} style={{justifyContent: 'center',alignItems: 'center', borderRadius:12, marginBottom:32,  width:330, height:58}}>
          <Text style={{color:'white', fontSize:20, fontWeight:'bold'}} >Continue</Text>
        </LinearGradient></TouchableOpacity>):null}

        <Text style={{marginBottom:52, fontSize:16, color:'rgb(47,109,182)'}} onPress={()=>this.createWallet()}>
          Skip
        </Text>
        {(this.state.isProcessing)?(<ActivityIndicator/>):null}

      </View>
    );
  }
}
