import React, { Component } from 'react'
import {View, Text, Image, TouchableOpacity, TextInput, AppState} from 'react-native';
import { observer, inject } from 'mobx-react/native'
import { action } from 'mobx'
import LinearGradient from 'react-native-linear-gradient';
import DefaultPreference from "react-native-default-preference";

@inject("appStore") @observer
export default class TradeScreen extends Component {
  constructor() {
    super();
    this.state = {
      isProcessing: false,
      privateKey: '',
      market: 'AIN/ETH',
      pay:'ETH',
      token:'AIN',
      mode:'Buy',
      price:'',
      amount:''
    };
  }
  componentDidMount(){
    console.log(DefaultPreference.get('privateKey').then((value)=>{
      this.setState({privateKey:value});
    }));
    this.requestSync();
    AppState.addEventListener('change', this.handleAppStateChange);

    this._navListener = this.props.navigation.addListener('willFocus', (route) => {
      this.requestSync();
    });
  }

  componentWillUnmount(){
    AppState.removeEventListener('change', this.handleAppStateChange);
    this._navListener.remove();
  }


  handleAppStateChange = (nextAppState) => {
    console.log(nextAppState);
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      this.requestSync();
    }
    this.setState({appState: nextAppState});
  }

  changeMarket(){

  }

  changeMode(mode){
    this.setState({mode:mode,price:'', amount:''});
  }

  moveHistory(){
    console.log('move');
  }

  inputPrice(text){
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

    this.setState({price:text});
  }

  inputAmount(text){
    let exp = /^[0-9]+$/;

    if(text.length > 0){
      let available = text.match(exp);
      console.log(available);
      if(available){

      }
      else{
        return;
      }
    }

    this.setState({amount:text});
  }


  getCurrentPrice(){
    let price = (this.props.appStore && this.props.appStore.priceInit) ? this.props.appStore.price : {};
    return  price[this.state.pay] ? price[this.state.pay][this.state.token].last : 0;
  }

  setCurrentPrice(){
    this.setState({price:this.getCurrentPrice()+''});
  }

  getCoinAmount(){
    let balance = (this.props.appStore && this.props.appStore.walletInit) ? this.props.appStore.wallet.balance : {};
    return balance[this.state.pay] ? balance[this.state.pay].value : 0;
  }

  getTokenAmount(){
    let balance = (this.props.appStore && this.props.appStore.walletInit) ? this.props.appStore.wallet.balance : {};
    return balance[this.state.token] ? balance[this.state.token].value : 0;
  }


  setMaxAmount(){
    let price = this.state.price ? this.state.price : this.getCurrentPrice();
    let max = 0;
    if(this.state.mode === 'Buy'){
      max = this.getCoinAmount() / parseFloat(price);
    }
    else{
      max = this.getTokenAmount();
    }

    this.setState({amount:max+'', price:price+''});
  }

  getAmount(){
    let amount = parseInt(this.state.amount);
    if(amount){
      return amount;
    }
    return 0;
  }

  getPrice(){
    let price = parseFloat(this.state.price);
    if(price){
      return price;
    }
    return 0;
  }


  requestSync(){

  }


  render() {
    let price = (this.props.appStore && this.props.appStore.priceInit) ? this.props.appStore.price : {};
    let diff = price[this.state.pay] ? price[this.state.pay][this.state.token].percentChange : 0;
    return (
      <LinearGradient colors={['#5da7dc', '#306eb6']} style={{ flex:1, alignItems: 'center'}}>
        <View style={{flexDirection:'row', marginTop:10, height:32}}>
          <View style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={()=>this.changeMarket()}>
              <Text style={{fontSize:20, marginLeft:52, color:'white'}}>
                {this.state.market}
              </Text>
              <Image style={{marginLeft:14}} source={require('../../assets/btnTradeCoinchange.png')}/>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=>this.moveHistory()}>
            <Image style={{marginRight:4}} source={require('../../assets/btnTradeHistory.png')} />
          </TouchableOpacity>
        </View>
        <View style={{marginTop:25, marginLeft:13, marginRight:13, flexDirection:'row', borderRadius:15, backgroundColor:'white'}}>
          <View style={{flex:1, alignItems:'center'}}>
            <View style={{flexDirection:'row', marginTop:16, alignItems:'center'}}>
              <Text style={{flex:1, textAlign:'center', fontSize:18, color:(this.state.mode==='Buy'?'rgb(51,77,172)':'rgb(206,206,206)')}} onPress={()=>this.changeMode('Buy')}>
                Buy
              </Text>
              <View style={{width:1, height:20, backgroundColor:'rgb(125,125,125)'}}/>

              <Text style={{fontSize:18, textAlign:'center', flex:1, color:(this.state.mode==='Sell'?'rgb(51,77,172)':'rgb(206,206,206)')}} onPress={()=>this.changeMode('Sell')}>
                Sell
              </Text>
            </View>
            <Text style={{marginTop:20, fontSize:14, color:'rgb(95,173,4)'}}>
              {this.getCurrentPrice()} / {diff}%
            </Text>
            <View style={{flexDirection:'row', alignItems:'flex-end'}}>
              <Text style={{fontSize:16, color:'rgb(155,155,155)'}}>Assets</Text>
              <Text style={{fontSize:24, marginLeft:8, marginRight:8, fontWeight:'bold', color:'rgb(4,4,4)'}}>{(this.state.mode==='Buy'?this.getCoinAmount():this.getTokenAmount())}</Text>
              <Text style={{fontSize:16, color:'rgb(155,155,155)'}}>{(this.state.mode==='Buy'?this.state.pay:this.state.token)}</Text>
            </View>

            <View style={{marginTop:27, flexDirection:'row', alignItems:'center'}}>
              <Text style={{marginLeft:27, width:60, fontSize:14, color:'rgb(155,155,155)'}}>
                Price
              </Text>
              <TextInput style={{borderWidth:0, marginLeft:20, marginRight:20, flex:1, fontSize:18, color:'rgb(37, 72, 143)', paddingTop:0, paddingBottom:0, paddingLeft:8, paddingRight:8}} value={this.state.price} keyboardType={'numeric'}  maxLength={20} underlineColorAndroid={'transparent'}
                         onChangeText={(text)=>this.inputPrice(text)} />
              <TouchableOpacity onPress={()=>this.setCurrentPrice()}>
              <Text style={{marginRight:25, fontSize:14, fontWeight:'bold', color:'rgb(123,123,123)'}}>
                Curr
              </Text>
              </TouchableOpacity>
            </View>
            <View style={{height:2,marginLeft:18, marginRight:18, backgroundColor:'rgb(155,155,155)', marginTop:7, flexDirection:'row'}}>
              <View style={{flex:1}}/>
            </View>

            <View style={{marginTop:31, flexDirection:'row', alignItems:'center'}}>
              <Text style={{marginLeft:27, fontSize:14, width:60, color:'rgb(155,155,155)'}}>
                Amount
              </Text>
              <TextInput style={{borderWidth:0, marginLeft:27, marginRight:25, flex:1, fontSize:18, color:'rgb(37, 72, 143)', paddingTop:0, paddingBottom:0, paddingLeft:8, paddingRight:8}} value={this.state.amount} keyboardType={'numeric'}  maxLength={20} underlineColorAndroid={'transparent'}
                         onChangeText={(text)=>this.inputAmount(text)} />
              <TouchableOpacity onPress={()=>this.setMaxAmount()}>
                <Text style={{marginRight:25, fontSize:14, fontWeight:'bold', color:'rgb(123,123,123)'}}>
                  Max
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{height:2,marginLeft:18, marginRight:18, backgroundColor:'rgb(155,155,155)', marginTop:7, flexDirection:'row'}}>
              <View style={{flex:1}}/>
            </View>

            <Text style={{marginTop:16, fontSize:20, color:'rgb(146,146,146)'}}>
              Total {this.getAmount()*this.getPrice()} {this.state.pay}
            </Text>

            <TouchableOpacity style={{width:200, marginTop:8, marginBottom:17, justifyContent:'center', alignItems:'center', borderRadius:24, height:40, backgroundColor:(this.state.mode==='Buy'?'rgb(95,173,4)':'rgb(182,0,100)')}}>
              <Text style={{fontSize:18, color:'white', fontWeight:'bold'}}>
                {this.state.mode}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex:1}}>

        </View>
        <View style={{backgroundColor:'white', height:152, flexDirection:'row'}}>
          <View style={{flex:1}}>
            <View style={{flexDirection:'row', height:38, backgroundColor:'rgba(182,0,100, 0.1)', alignItems:'center'}}>
              <Text style={{flex:1, marginLeft:25}}>
                0.42333
              </Text>
              <Text style={{marginRight:12}}>
                32
              </Text>
            </View>

          </View>
          <View style={{flex:1}}>
            <View style={{flexDirection:'row', height:38, backgroundColor:'rgba(95,173,4, 0.1)', alignItems:'center'}}>
              <Text style={{flex:1, marginLeft:18}}>
                0.44333
              </Text>
              <Text style={{marginRight:25}}>
                10
              </Text>
            </View>
          </View>


        </View>
      </LinearGradient>
    );
  }
}
