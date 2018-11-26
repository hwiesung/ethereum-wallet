import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ActivityIndicator, TextInput} from 'react-native';
import { observer, inject } from 'mobx-react/native'
import { NavigationActions, StackActions } from 'react-navigation'
import LinearGradient from 'react-native-linear-gradient';
import Toast, {DURATION} from 'react-native-easy-toast'

import {action} from "mobx/lib/mobx";

const ADDRESS_KEY_LENGTH=42;
@inject("appStore") @observer
export default class WithdrawalAddress extends Component {
  constructor() {
    super();

    this.state = {
      isProcessing : false,
      value: '',
      complete:false
    };
  }

  componentDidMount(){

  }

  @action.bound
  transactionAdded(success, receipt){
    console.log('transaction callback:'+success);
    this.setState({isProcessing:false});
    if(!success){
      this.refs.toast.show('transaction failed. Try again later', DURATION.LENGTH_SHORT);
      return;
    }

    this.props.navigation.dispatch(StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'WalletHome' })]
    }))
  }


  inputText(text){
    let alphaExp = /^[0-9a-zA-Z]+$/;
    if(text.length > 0){
      let available = text.match(alphaExp);
      if(available){
        text = text.toLowerCase();
      }
      else{
        return;
      }
    }

    if(text.length >0 && text.indexOf('0x') < 0){
      if(text != '0' ){
        text = '0x'+text;
      }
    }

    this.setState({value:text,complete:(text.length == ADDRESS_KEY_LENGTH)});
  }


  backNavigation(){
    console.log(this.props.navigation);
    this.props.navigation.pop();
  }

  sendToken(){
    let token = this.props.navigation.getParam('token', {});
    let amount = this.props.navigation.getParam('amount', '0');
    let localWallet = this.props.appStore ? this.props.appStore.localWallets[token.address] : {};

    if(this.state.complete && localWallet.privateKey){
      let params = {from:localWallet.address, to:this.state.value, amount:amount, privateKey:localWallet.privateKey, token:token.symbol};
      console.log(params);
      this.setState({isProcessing:true});
      if(token.symbol === token.coin){
        this.props.appStore.sendTransaction(params, this.transactionAdded);
      }
      else{
        this.props.appStore.transferToken(params, this.transactionAdded);
      }
   }

  }

  scanQrCode(){

  }


  render() {

    return (
      <LinearGradient colors={['#5da7dc', '#306eb6']} style={{ flex:1}}>
        <View style={{flexDirection:'row',  marginTop:25, height:30, alignItems:'center'}}>
          <TouchableOpacity style={{marginLeft:13, width:80}} onPress={()=>this.backNavigation()}>
            <Image source={require('../../assets/btnCommonBackShadow.png')}/>
          </TouchableOpacity>
          <Text style={{color:'white', fontSize:20, flex:1, marginRight:80, textAlign:'center'}}>Withdrawal</Text>
        </View>

        <View style={{marginTop:25, marginLeft:13, marginRight:13, marginBottom:38, flexDirection:'row', borderRadius:15, backgroundColor:'white'}}>
          <View style={{flex:1}}>
            <View style={{flexDirection:'row'}}>
              <Text style={{ flex:1, marginTop:22, textAlign:'center', fontSize:18, color:'rgb(37,72,143)', fontWeight:'bold'}}>Recipient Address</Text>
            </View>

            <Text style={{ marginTop:52, marginLeft:22, fontSize:14, color:'rgb(155,155,155)'}}>Enter receiving address</Text>

            <View style={{height:30,  backgroundColor:'rgb(243,243,243)', borderWidth:1, borderColor:'rgb(220,220,220)', borderRadius:5, marginTop:8, marginLeft:20, marginRight:20}}>
              <TextInput style={{borderWidth:0, fontSize:16, paddingTop:0, paddingBottom:0, paddingLeft:8, paddingRight:8}} value={this.state.value} maxLength={ADDRESS_KEY_LENGTH} underlineColorAndroid={'transparent'}
                         onChangeText={(text)=>this.inputText(text)} />

            </View>

            <TouchableOpacity onPress={()=>this.scanQrCode()} style={{flexDirection:'row', backgroundColor:'rgb(95,173,4)', alignItems:'center', height:40, marginTop:12, marginBottom:61, borderRadius:25, marginLeft:14, marginRight:14}}>
              <Image style={{marginLeft:10}} source={require('../../assets/btnDepositQr.png')}/>
              <Text style={{flex:1, textAlign:"center", marginRight:30, color:'white', fontSize:14, fontWeight:'bold'}}>
                QR Code
              </Text>

            </TouchableOpacity>

          </View>

        </View>
        <Toast style={{marginBottom:60}} ref="toast"/>
        <View style={{flex:1}}>
        </View>

        {(!this.state.isProcessing)?(<TouchableOpacity onPress={()=>this.sendToken()} style={{justifyContent: 'center',alignItems: 'center', marginLeft:15, marginRight:15, backgroundColor:'white', marginBottom:38, borderRadius:12, marginTop:14, height:58}}>
          <Text style={{color:(this.state.complete?'black':'rgb(155,155,155)'), fontSize:20, fontWeight:'bold'}}>Send</Text>
        </TouchableOpacity>):(<ActivityIndicator style={{marginBottom:38}}/>)}

      </LinearGradient>
    );
  }
}
