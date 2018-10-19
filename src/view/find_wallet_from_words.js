import React, { Component } from 'react'
import { View,  Button, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import {firebaseApp} from "../firebase";
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
const instance = axios.create({
  baseURL: 'https://us-central1-sonder-6287a.cloudfunctions.net/',
  timeout: 5000,
  headers: {'Content-Type':'application/json'}
});
import Toast, {DURATION} from 'react-native-easy-toast'
import { action } from 'mobx'
import { observer, inject } from 'mobx-react/native'
import DefaultPreference from "react-native-default-preference";

const WORDS_LENGTH=12;

@inject("appStore") @observer
export default class FindWalletFromWords extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      complete: false,
      isProcessing:false
    };
  }

  backNavigation(){
    console.log(this.props.navigation);
    this.props.navigation.pop();
  }

  inputText(text){
    let alphaExp = /^[a-zA-Z\s]+$/;
    let complete = false;
    if(text.length > 0){
      let available = text.match(alphaExp);
      if(available){
        text = text.toLowerCase();
        complete = true;
      }
      else{
        return;
      }
    }

    this.setState({value:text,complete:complete});
  }

  findWallet(){
    this.setState({isProcessing:true});
    let address = '';
    let privateKey = '';
    let mnemonic =this.state.value;
    instance.post('restore_wallet', {mnemonic:mnemonic}).then( (result)=>{
      console.log(result.data);
      let ret = result.data.ret_code;
      if(ret === 0){
        address = result.data.address;
        privateKey = result.data.privateKey;
        return DefaultPreference.set('privateKey', privateKey);
      }
      else if(ret === 1){
        throw 'Wrong secret words';
      }
      else if(ret === 2){
        throw 'There is no wallet';
      }
    }).then(()=>{
      console.log('pk saved');
      this.props.appStore.saveWallet(address, '', mnemonic, privateKey, this.walletCrated);
    }).catch((err)=>{
      this.refs.toast.show(err, DURATION.LENGTH_SHORT);
      this.setState({isProcessing:false});
    });
  }

  @action.bound
  walletCrated(){
    console.log('wallet added!!!');
    this.setState({isProcessing:false});
    this.props.navigation.navigate('CompleteWallet', {msg:'Wallet added!'});
  }

  render() {
    let btnColor = (this.state.complete)? ['#5da7dc', '#306eb6']: ['#dbdbdb','#b5b5b5'];

    return (
      <View style={{ flex: 1, backgroundColor:'white'}}>
        <TouchableOpacity style={{marginLeft:14, marginTop:25, width:100, height:44}} onPress={()=>this.backNavigation()}>
          <Image source={require('../../assets/btnCommonX44Pt.png')}/>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize:22, fontWeight:'bold', color:'black', marginTop:54}}>Add Wallet</Text>
          <Text style={{fontSize:16, color:'rgb(155,155,155)', marginTop:20}}>Input your secret words you saved</Text>
          <View style={{height:126, width:324, backgroundColor:'rgb(243,243,243)', borderWidth:1, borderColor:'rgb(220,220,220)', borderRadius:5, padding:12, marginTop:77}}>
            <TextInput style={{borderWidth:0, fontSize:16}} value={this.state.value} placeholder={'Input Secret Words'} multiline={true} underlineColorAndroid={'transparent'}
                       onChangeText={(text)=>this.inputText(text)} />

          </View>
          {(this.state.isProcessing)?(<ActivityIndicator style={{marginTop:40}}/>):null}

        </View>


        {(!this.state.isProcessing)?(<TouchableOpacity style={{marginBottom:47, alignItems: 'center'}} onPress={()=>this.findWallet()}>
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={btnColor} style={{justifyContent: 'center',alignItems: 'center', borderRadius:12, width:330, height:58}}>
            <Text style={{color:'white', fontSize:20, fontWeight:'bold'}} >Connect</Text>
          </LinearGradient>
        </TouchableOpacity>):null}
        <Toast ref="toast"/>
      </View>
    );
  }
}
