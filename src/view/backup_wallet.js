import React, { Component } from 'react'
import { View,  Image, Text, ActivityIndicator, TouchableOpacity } from 'react-native';

import axios from 'axios';
import { observer, inject } from 'mobx-react/native'
import { action } from 'mobx'
import LinearGradient from 'react-native-linear-gradient';
import DefaultPreference from "react-native-default-preference";
import {NavigationActions, StackActions} from "react-navigation";



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
      isProcessing:false,
      coin:'ETH'
    };
  }


  moveToBackup(){
    if(this.state.agree){
      this.props.navigation.navigate('Secret');
    }
  }

  backNavigation(){
    this.props.navigation.pop();
  }

  clickAgree(){
    this.setState({agree:!this.state.agree});
  }

  createWallet(){
    this.setState({isProcessing:true});
    this.props.appStore.obtainNewAccount(this.accountObtained);

  }

  @action.bound
  accountObtained(account){
    console.log(account);
    let newWallet = {address:account.address, isImported:false};
    this.props.appStore.saveWallet(this.state.coin, newWallet, account.privateKey, account.mnemonic, this.walletCreated);
  }


  @action.bound
  walletCreated(){
    console.log('wallet created!!!');
    if(Object.keys(this.props.appStore.localWallets).length > 1){
      this.props.navigation.dispatch(StackActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'MyHome' })]
      }));
    }
    else{
      this.props.navigation.navigate('CompleteWallet', {msg:'Wallet added!'});
    }
  }


  render() {

    let btnColor = (this.state.agree)? ['#5da7dc', '#306eb6']: ['#dbdbdb','#b5b5b5'];
    return (
      <View style={{ flex: 1, backgroundColor:'white'}}>
        <TouchableOpacity style={{marginLeft:14, marginTop:25, width:100, height:44}} onPress={()=>this.backNavigation()}>
          <Image source={require('../../assets/btnCommonX44Pt.png')}/>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center'}}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'white' }}>
            <Text style={{marginTop:98, fontSize:22, color:'black', fontWeight:'bold'}}>Backup Your account</Text>
            <Text style={{marginTop:20, marginLeft:26, marginRight:26, fontSize:16, textAlign:'center', color:'rgb(155,155,155)'}}> These 12 words are the only way to restore your Trust wallet. save them somewhere safe and secret</Text>

          </View>

          {(!this.state.isProcessing)?(<TouchableOpacity style={{ flexDirection:'row', marginBottom:21}} onPress={()=>this.clickAgree()}>
            {this.state.agree?<Image source={require('../../assets/btnCommonCheckFill.png')}/>:<Image source={require('../../assets/btnCommonCheckEmpty.png')}/>}
            <Text style={{width:280, marginLeft:14, fontSize:14, color:'black' }}>I understand that if I lose my secret phrase, I will not be able to access my account.</Text>
          </TouchableOpacity>):null}

          {(!this.state.isProcessing)?(<TouchableOpacity onPress={()=>this.moveToBackup()}><LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={btnColor} style={{justifyContent: 'center',alignItems: 'center', borderRadius:12, marginBottom:32,  width:330, height:58}}>
            <Text style={{color:'white', fontSize:20, fontWeight:'bold'}} >Continue</Text>
          </LinearGradient></TouchableOpacity>):<ActivityIndicator/>}

          {(!this.state.isProcessing)?(<Text style={{marginBottom:52, fontSize:16, color:'rgb(47,109,182)'}} onPress={()=>this.createWallet()}>
            Skip
          </Text>):null}

        </View>


      </View>
    );
  }
}
