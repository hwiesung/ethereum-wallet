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
export default class TradeHistory extends Component {
  constructor() {
    super();

    this.state = {
      isProcessing : false,
      selected:0
    };
  }

  componentDidMount(){
    let token = this.props.navigation.getParam('token', '');
    let coin = this.props.navigation.getParam('coin', '');

    console.log(token);
    this.props.appStore.requestTradeHistorySync(coin, token);

  }

  backNavigation(){
    this.props.navigation.pop();
  }

  componentWillUnmount() {

  }

  numberFormat(number){
    let formmated = '';
    if(number < (1/Math.pow(10,5))){
      formmated = numeral(number).format('0.00000e+0');
    }
    else if(number > Math.pow(10,5)){
      formmated = numeral(number).format('0,0.0');
    }
    else{
      formmated = numeral(number).format('0,0.000');
    }

    return formmated;
  }

  selectMenu(menu){
    this.setState({selected:menu});
  }

  cancelOrder(order){
    console.log(order);
    Alert.alert(
      'Cancel Order',
      'Are you cancel order?',
      [
        {text: 'Close', onPress: () => {}, style: 'cancel'},
        {text: 'Cancel Order', onPress: () => {
          //request cancel
          }},
      ],
      { cancelable: false }
    )
  }

  render() {
    let token = this.props.navigation.getParam('token', '');
    let coin = this.props.navigation.getParam('coin', '');
    let wallet = (this.props.appStore && this.props.appStore.walletInit) ? this.props.appStore.wallet : {};
    let history = (this.props.appStore && this.props.appStore.transactionInit && this.props.appStore.tradeHistory[coin] && this.props.appStore.tradeHistory[coin][token] ) ? this.props.appStore.tradeHistory[coin][token].history : {};

    let list = [];
    for(let tid in history){
      list.push(history[tid]);
    }


    if(list.length>0){
      list.sort((a, b)=>{return  b.timestamp-a.timestamp});
    }
    console.log(list);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.tid !== r2.tid});
    let dataSource = ds.cloneWithRows(list);

    return (
      <LinearGradient colors={['#5da7dc', '#306eb6']} style={{ flex:1}}>
        <View style={{flexDirection:'row',  marginTop:25, height:30, alignItems:'center'}}>
          <TouchableOpacity style={{marginLeft:13, width:80}} onPress={()=>this.backNavigation()}>
            <Image source={require('../../assets/btnCommonBackShadow.png')}/>
          </TouchableOpacity>
          <Text style={{color:'white', fontSize:20, flex:1, marginRight:80, textAlign:'center'}}>Order History</Text>
        </View>

        <View style={{flex:1, marginTop:25, marginLeft:13, marginRight:13, marginBottom:38, borderRadius:15, backgroundColor:'white'}}>
          <View style={{flexDirection:'row', marginTop:14}}>

            <Text style={{fontSize:18, flex:1, textAlign:'center', color:(this.state.selected===0?'rgb(37,72,143)':'rgb(196,196,196)')}} onPress={()=>this.selectMenu(0)} >
              미체결 내역
            </Text>

            <View style={{width:1, height:20, backgroundColor:'rgba(216,216,216,0.5)'}}/>

            <Text style={{fontSize:18, flex:1, textAlign:'center', color:(this.state.selected===1?'rgb(37,72,143)':'rgb(196,196,196)')}} onPress={()=>this.selectMenu(1)} >
              체결 내역
            </Text>
          </View>
          <View style={{flexDirection:'row', marginTop:27}}>
            <Text style={{fontSize:14,  marginLeft:25, color:'rgb(37,72,143)', letterSpacing:0.7}}>
              Type
            </Text>
            <Text style={{flex:1, marginLeft:74, fontSize:14, color:'rgb(37,72,143)', letterSpacing:0.7}}>
              Price
            </Text>
            <Text style={{fontSize:14, color:'rgb(37,72,143)', marginRight:14, letterSpacing:0.7}}>
              Amount / Fee
            </Text>
          </View>
          <View style={{flex:1, flexDirection:'row', marginLeft:14, marginRight:14,  marginBottom:28}}>
            <ListView style={{flex:1}} dataSource={dataSource}
                      renderRow={(rowData) =>
                        <View >
                          <View style={{flexDirection:'row', height:60, alignItems:'center'}}>

                            <View>
                              <View style={{flexDirection:'row', alignItems:'center'}}>
                                <View style={{width:18, height:18, borderRadius:90,  alignItems:'center', justifyContent:'center', backgroundColor:(rowData.type==='buy'?'rgb(95,173,4)':'rgb(182,0,100)')}}>
                                  <Text style={{color:'white', fontSize:14, fontWeight:'bold'}}>
                                    {rowData.type==='buy'?'B':'S'}
                                  </Text>
                                </View>
                                <Text style={{marginLeft:4, fontSize:16, color:'black'}}>
                                  {token} /
                                </Text>
                                <Text style={{marginLeft:4, fontSize:12, color:'black'}}>
                                  {coin}
                                </Text>
                              </View>
                              <Text>
                                {moment(rowData.timestamp,'X').format('MM-DD hh:mm:ss')}
                              </Text>
                            </View>

                            <Text style={{flex:1, fontSize:14, marginLeft:12, color:'rgb(155,155,155)', letterSpacing:0.7}}>{this.numberFormat(rowData.price)}</Text>

                            <View style={{marginRight:5, alignItems:'flex-end'}}>
                              <Text style={{fontSize:12, color:(rowData.type==='buy'?'rgb(95,173,4)':'rgb(182,0,100)'), letterSpacing:0.6}}>{this.numberFormat(rowData.amount)}</Text>
                              <Text style={{fontSize:12, color:'rgb(155,155,155)', letterSpacing:0.6}}>{this.numberFormat(rowData.gasFee)}</Text>
                            </View>
                            {this.state.selected===0?(<TouchableOpacity onPress={()=>this.cancelOrder(rowData)}><Image source={require('../../assets/btnCommonXRound.png')}/></TouchableOpacity>):null}


                          </View>
                          <View style={{flex:1, backgroundColor:'rgb(230,230,230)', height:1}}/>
                        </View>
                      }/>
          </View>
        </View>



      </LinearGradient>
    );
  }
}
