import React, { Component } from 'react'
import { AppState, View, Text, Image, TouchableOpacity} from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import axios from 'axios';
import { observer, inject } from 'mobx-react/native'
import { action } from 'mobx'
import LinearGradient from 'react-native-linear-gradient';
const timer = require('react-native-timer');
var numeral = require('numeral');

@inject("appStore") @observer
export default class MyScreen extends Component {
  constructor() {
    super();
    this.state = {
      isProcessing : false,
      privateKey:'',
      coin: 'ETH',
      appState: AppState.currentState
    };
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }


  moveMenu(munu){
    //this.props.navigation.navigate('TokenDetail', {token:token});
  }

  requestSync(){
    this.props.appStore.requestBalanceSync();
    this.props.appStore.requestPriceSync(this.state.coin);
  }



  render() {
    let balance = (this.props.appStore && this.props.appStore.walletInit) ? this.props.appStore.wallet.balance : {};
    let price = (this.props.appStore && this.props.appStore.priceInit) ? this.props.appStore.price : {};


    const settingMenu = [
      {title:'Profile', value:this.props.appStore.user.nickname}
      ,{title:'General'}
      ,{title:'Wallets'}
      ,{title:'Security'}
      ,{title:'Support'}

    ];

    let total = 0;
    Object.keys(balance).forEach((symbol)=>{
      let token = balance[symbol];
      let rate = 0;
      if(this.state.coin === symbol){
        rate = price[symbol].price;
      }
      else{
        rate = price[this.state.coin][symbol].last * price[this.state.coin].price;
      }
      total+=token.value*rate;
    });



    return (
      <View  style={{ flex:1, backgroundColor:'white', alignItems: 'center'}}>

        <View style={{flexDirection:'row', marginTop:28}}>
          <Text style={{flex:1, textAlign:'center', fontSize:22, fontWeight:'bold', color:'rgb(74,74,74)'}}>My Info</Text>
        </View>
        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#5da7dc', '#306eb6']} style={{marginTop:28, borderRadius:12, width:290, height:103}}>
          <Text style={{marginTop:18, marginLeft:18, fontSize:16, color:'white'}}>Total Balance</Text>
          <View style={{flexDirection:'row', alignItems:'flex-end', marginTop:12}}>
            <Text style={{color:'white', fontSize:24, flex:1, textAlign:'right', fontWeight:'bold'}}>{numeral(total).format('0,0.00')}</Text>
            <Text style={{color:'white', fontWeight:'bold', fontSie:18,marginLeft:8, marginRight:30}}>USD</Text>
          </View>
        </LinearGradient>
        <View style={{flex:1}}>
        </View>
        <View style={{flexDirection:'row'}}>
          <View style={{marginBottom:20, flex:1}}>
            {
              settingMenu.map((menu, index)=>{
                return (
                  <View key={index} style={{flexDirection:'row'}}>
                    <TouchableOpacity style={{flex:1}} onPress={()=>this.moveMenu(index)}>
                      <View style={{flexDirection:'row', height:60, alignItems:'center'}}>
                        <Text style={{ marginLeft:22, flex:1, fontSize:18, fontWeight:'bold', color:'rgb(74,74,74)'}}>{menu.title}</Text>
                        <Text style={{marginRight:20, fontSize:18, color:'rgb(155,155,155)'}}> {menu.value} > </Text>
                      </View>
                      <View style={{flexDirection:'row', height:1, backgroundColor:'rgb(242,242,242)'}}/>
                    </TouchableOpacity>

                  </View>);
              })
            }
          </View>

        </View>



      </View>
    );
  }
}
