import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ListView, Alert} from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import axios from 'axios';
const moment = require('moment');
import { observer, inject } from 'mobx-react/native'
import { action } from 'mobx'
import LinearGradient from 'react-native-linear-gradient';
var numeral = require('numeral');

@inject("appStore") @observer
export default class ManageWallet extends Component {
  constructor() {
    super();

    this.state = {
      coin:'ETH',
      isProcessing : false,
      selected:0
    };
  }

  componentDidMount(){


  }

  backNavigation(){
    this.props.navigation.pop();
  }

  componentWillUnmount() {

  }

  addWallet(){
    this.props.navigation.navigate('AddWallet');
  }

  editWallet(wallet){

    this.props.navigation.navigate('EditWallet', {wallet:wallet});
  }

  render() {
    let wallets = (this.props.appStore && this.props.appStore.walletInit) ? this.props.appStore.wallet[this.state.coin] : {};
    let localWallets = (this.props.appStore) ? this.props.appStore.localWallets : {};
    let list = [];

    for(let address in localWallets){
      let wallet = localWallets[address];
      wallet.name = wallets[wallet.address].name;
      list.push(wallet);
    }


    return (
      <LinearGradient colors={['#5da7dc', '#306eb6']} style={{ flex:1}}>
        <View style={{flexDirection:'row',  marginTop:25, height:30, alignItems:'center'}}>
          <TouchableOpacity style={{marginLeft:13, width:80}} onPress={()=>this.backNavigation()}>
            <Image source={require('../../assets/btnCommonBackShadow.png')}/>
          </TouchableOpacity>
          <Text style={{color:'white', fontSize:20, flex:1, marginRight:80, textAlign:'center'}}>Manage Wallets</Text>
        </View>

        <View style={{flex:1,  marginLeft:13, marginRight:13,  marginTop:45, marginBottom:28}}>
          {list.map((item, index)=>{
            return (<View key={index} >
              <TouchableOpacity onPress={()=>this.editWallet(item)} style={{flexDirection:'row', marginBottom:20, height:74, backgroundColor:'white', borderRadius:15, alignItems:'center'}}>

                <Image style={{marginLeft:20}} source={require('../../assets/btnCommonArrange.png')}/>
                <Text style={{marginLeft:8, flex:1, fontSize:26, fontWeight:'bold', color:'rgb(74,74,74)'}}>{item.name}</Text>
                <Image style={{marginRight:24}} source={require('../../assets/btnDepositQrBig.png')}/>
              </TouchableOpacity>
            </View>)
          })}

          <TouchableOpacity onPress={()=>this.addWallet()} style={{flexDirection:'row', height:74, alignItems:'center', borderRadius:15, backgroundColor:'rgba(255,255,255,0.2)'}}>
            <View style={{width:22, marginLeft:21, height:22, borderRadius:2, borderColor:'rgba(255,255,255,0.3)', borderWidth:2}}/>
            <Text style={{fontSize:26, fontWeight:'bold', marginLeft:11, color:'rgba(255,255,255,0.3)'}}>
              Add Wallet
            </Text>

          </TouchableOpacity>

          <View style={{flex:1}}/>

        </View>





      </LinearGradient>
    );
  }
}
