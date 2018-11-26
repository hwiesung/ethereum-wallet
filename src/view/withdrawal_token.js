import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ListView, ActivityIndicator, TextInput} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
const moment = require('moment');
import { observer, inject } from 'mobx-react/native'
import LinearGradient from 'react-native-linear-gradient';

@inject("appStore") @observer
export default class WithdrawalToken extends Component {
  constructor() {
    super();

    this.state = {
      isProcessing : false,
      value: '',
    };
  }

  componentDidMount(){



  }

  inputText(text){
    let exp = /^[0-9\.]+$/;

    if(text.length > 0){
      let available = text.match(exp);
      console.log(available);
      if(available){

      }
      else{
        return;
      }
    }
    console.log(text);


    this.setState({value:text});
  }


  backNavigation(){
    console.log(this.props.navigation);
    this.props.navigation.pop();
  }

  moveNext(balance){
    let token = this.props.navigation.getParam('token', {});
    if(balance < parseFloat(this.state.value)){
      this.refs.toast.show('not enough balance', DURATION.LENGTH_SHORT);
      return;
    }
    this.props.navigation.navigate('WithdrawalAddress', {token:token, amount:this.state.value});
  }



  render() {
    let token = this.props.navigation.getParam('token', {});
    let wallet = (this.props.appStore && this.props.appStore.walletInit) ? this.props.appStore.wallet[token.coin][token.address] : {};

    let balance = '';

    if(token.coin===token.symbol){
      balance = wallet.balance?wallet.balance.value:'';
    }
    else{
      balance = wallet.token && wallet.token[token.symbol]?wallet.token[token.symbol].value:'';
    }


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
              <Text style={{ flex:1, marginTop:22, textAlign:'center', fontSize:18, color:'rgb(37,72,143)', fontWeight:'bold'}}>Withdrawal {token.symbol}</Text>
            </View>

            <Text style={{ marginTop:20, marginLeft:22, fontSize:20, fontWeight:'bold', color:'rgb(0,0,0)'}}>{token.symbol}</Text>
            <Text style={{ marginTop:8, marginLeft:22, fontSize:14, color:'rgb(155,155,155)'}}>Enter Amount</Text>

            <View style={{height:30,  backgroundColor:'rgb(243,243,243)', borderWidth:1, borderColor:'rgb(220,220,220)', borderRadius:5, marginTop:8, marginLeft:20, marginRight:20}}>
              <TextInput style={{borderWidth:0, fontSize:16, paddingTop:0, paddingBottom:0, paddingLeft:8, paddingRight:8}} value={this.state.value} keyboardType={'numeric'} maxLength={30} underlineColorAndroid={'transparent'}
                         onChangeText={(text)=>this.inputText(text)} />

            </View>

            <View style={{flexDirection:'row', marginTop:10, marginBottom:86, marginLeft:22, marginRight:25}}>
              <Text style={{flex:1}}>
                My Balance : {balance} {token.symbol}
              </Text>
              <TouchableOpacity onPress={()=>this.inputText(balance)}>
                <Text>Send All</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>
        <Toast style={{marginBottom:60}} ref="toast"/>
        <View style={{flex:1}}>
        </View>

        {(!this.state.isProcessing)?(<TouchableOpacity onPress={()=>this.moveNext(balance)} style={{justifyContent: 'center',alignItems: 'center', marginLeft:15, marginRight:15, backgroundColor:'white', marginBottom:38, borderRadius:12, marginTop:14, height:58}}>
            <Text style={{color:'black', fontSize:20, fontWeight:'bold'}}>Next</Text>
        </TouchableOpacity>):(<ActivityIndicator style={{marginBottom:38}}/>)}

      </LinearGradient>
    );
  }
}
