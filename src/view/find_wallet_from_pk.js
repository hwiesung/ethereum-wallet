import React, { Component } from 'react'
import { View,  Button, Text, TextInput,TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import {firebaseApp} from "../firebase";
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import DefaultPreference from "react-native-default-preference";
import Toast, {DURATION} from 'react-native-easy-toast'
import { observer, inject } from 'mobx-react/native'
import { action } from 'mobx'
import {NavigationActions, StackActions} from "react-navigation";
const PRIVATE_KEY_LENGTH=66;

const instance = axios.create({
  baseURL: 'https://comcom-wallet-api.herokuapp.com/',
  timeout: 30000,
  headers: {'Content-Type':'application/json'}
});

@inject("appStore") @observer
export default class FindWalletFromPrivateKey extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      complete: false,
      coin:'ETH',
      isProcessing:false
    };
  }

  backNavigation(){
    console.log(this.props.navigation);
    this.props.navigation.pop();
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

    this.setState({value:text,complete:(text.length == PRIVATE_KEY_LENGTH)});
  }

  findWallet(){
    this.setState({isProcessing:true});
    let address = '';
    let privateKey = '';
    instance.get('account/'+this.state.value).then( (result)=>{
      console.log(result);
      address = result.data.address.toLowerCase();
      privateKey = result.data.privateKey;

      let newWallet = {address:address, mnemonic:'', encrypted:''};

      this.props.appStore.saveWallet(this.state.coin, newWallet, privateKey, this.walletCreated);
    }).catch((err)=>{
      this.refs.toast.show('Failed to add wallet, try again later.', DURATION.LENGTH_SHORT);
      this.setState({isProcessing:false});
    });
  }


  @action.bound
  walletCreated(address){
    console.log('wallet added!!!');

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

    let btnColor = (this.state.complete)? ['#5da7dc', '#306eb6']: ['#dbdbdb','#b5b5b5'];

    return (
      <View style={{ flex: 1, backgroundColor:'white'}}>
        <TouchableOpacity style={{marginLeft:14, marginTop:25, width:100, height:44}} onPress={()=>this.backNavigation()}>
          <Image source={require('../../assets/btnCommonX44Pt.png')}/>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize:22, fontWeight:'bold', color:'black', marginTop:54}}>Add Wallet</Text>
          <Text style={{fontSize:16, color:'rgb(155,155,155)', marginTop:20}}>Input your private key</Text>
          <View style={{height:126, width:324, backgroundColor:'rgb(243,243,243)', borderWidth:1, borderColor:'rgb(220,220,220)', borderRadius:5, padding:12, marginTop:77}}>
            <TextInput style={{borderWidth:0, fontSize:16}} value={this.state.value} placeholder={'Input Private Key'} multiline={true} maxLength={PRIVATE_KEY_LENGTH} underlineColorAndroid={'transparent'}
                       onChangeText={(text)=>this.inputText(text)} />

          </View>

          {(this.state.isProcessing)?(<ActivityIndicator style={{marginTop:40}}/>):null}
        </View>


        {(!this.state.isProcessing)?(<TouchableOpacity style={{marginBottom:47, alignItems: 'center'}} onPress={()=>this.findWallet()}>
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={btnColor} style={{justifyContent: 'center',alignItems: 'center', borderRadius:12, width:330, height:58}}>
            <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>Connect</Text>
          </LinearGradient>
        </TouchableOpacity>):null}


        <Toast ref="toast"/>
      </View>
    );
  }
}
