import React, { Component } from 'react'
import { AppState, View, Text, Image, FlatList, Clipboard, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { observer, inject } from 'mobx-react/native'
import { action } from 'mobx'
import LinearGradient from 'react-native-linear-gradient';
import Toast, {DURATION} from 'react-native-easy-toast'
const timer = require('react-native-timer');
var numeral = require('numeral');


@inject("appStore") @observer
export default class WalletScreen extends Component {
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


  moveDetail(token){
    console.log(token);
    this.props.navigation.navigate('TokenDetail', {token:token});
  }

  requestSync(){
    let localWallets = this.props.appStore ?this.props.appStore.localWallets : {};
    for(let address in localWallets){
      this.props.appStore.requestBalanceSync(this.state.coin, address);
    }

    this.props.appStore.requestPriceSync(this.state.coin);
  }

  selectWallet(index){
    this.props.appStore.selectWallet(index);
  }

  showQrCode(address){
    this.writeToClipboard(address).then(()=>{
      this.refs.toast.show('copied address!', DURATION.LENGTH_SHORT);
    });
  }

  writeToClipboard = async (text) => {
    await Clipboard.setString(text);
  };



  render() {
    let price = (this.props.appStore && this.props.appStore.priceInit) ? this.props.appStore.price : {};
    let wallet = (this.props.appStore && this.props.appStore.walletInit) ? this.props.appStore.wallet[this.state.coin] : {};
    let localWallets = this.props.appStore ?this.props.appStore.localWallets : {};
    let selected = this.props.appStore ? this.props.appStore.selectedWallet : 0;

    let tokens = [];

    let currentAddress = '';
    let wallets = [];
    for(let address in localWallets){
      wallets.push(localWallets[address]);
      if(localWallets[address].index === selected){
        currentAddress = address;
      }
    }

    let currentWallet ={};

    if(currentAddress){
      let wallet = (this.props.appStore && this.props.appStore.walletInit) ? this.props.appStore.wallet : {};
      if(wallet[this.state.coin]){
        currentWallet = wallet[this.state.coin][currentAddress];

        tokens.push({name:currentWallet.balance.name, coin:this.state.coin, symbol:currentWallet.balance.symbol, index:0, amount:currentWallet.balance.value, value:numeral(currentWallet.balance.value*price[this.state.coin].price).format('0,0.00')+' USD'});

        if(currentWallet.token){
          Object.keys(currentWallet.token).forEach((symbol)=>{
            let token = currentWallet.token[symbol];
            let rate = price[this.state.coin][symbol].last * price[this.state.coin].price;
            tokens.push({name:token.name, coin:this.state.coin, symbol:token.symbol, index:token.index, amount:token.value, value:numeral(token.value*rate).format('0,0.00')+' USD'});
          });
        }

      }
    }

    tokens.sort((a, b)=>{return a.index - b.index});
    return (
      <LinearGradient colors={['#5da7dc', '#306eb6']} style={{ flex:1}}>
        <View style={{height:28, marginTop:31}}>
          <FlatList horizontal={true} data={wallets} style={{marginLeft:13, height:28, marginRight:13}} renderItem={({ item: rowData }) => {
            let name = wallet[rowData.address] ? wallet[rowData.address].name : '';
            return (<TouchableOpacity keyExtractor={(item, index) => index} onPress={()=>this.selectWallet(rowData.index)} style={{height:28,  marginRight:14, borderRadius:14, justifyContent:'center', backgroundColor:(selected===rowData.index)?'white':'rgba(255,255,255,0.2)'}}>
              <Text style={{fontSize:14, marginLeft:14, marginRight:14, color:(selected===rowData.index)?'rgb(74,74,74)':'rgba(255,255,255,0.5)', fontWeight:'bold'}}>{name}</Text>
            </TouchableOpacity>)
          }} />
        </View>

        <Toast style={{marginBottom:60}} ref="toast"/>
        <View style={{flex:1, marginTop:20,  marginLeft:13, marginRight:13, marginBottom:18, flexDirection:'row', borderRadius:15, backgroundColor:'white'}}>
          <View style={{flex:1}}>
            <Text style={{marginLeft:21, marginTop:21, fontSize:26, color:'rgb(74,74,74)', fontWeight:'bold'}}>{currentWallet.balance?currentWallet.balance.name:this.state.coin} Wallet</Text>
            <TouchableOpacity onPress={()=>this.showQrCode(currentWallet.address)}  style={{marginTop:21, flexDirection:'row'}}>
              <Text style={{flex:1, marginLeft:30, fontSize:12, color:'rgb(48,110,182)'}}>{currentWallet.address}</Text>
              <Image style={{marginLeft:18, marginRight:30, marginTop:4}} source={require('../../assets/btnDepositQrBig.png')}/>
            </TouchableOpacity>
            <View style={{flexDirection:'row', height:4, marginTop:8, marginLeft:18, marginRight:18, backgroundColor:'rgb(37,72,143)'}}/>
            <View style={{flex:1, backgroundColor:'rgb(240,240,240)', marginTop:16, borderBottomLeftRadius:15, borderBottomRightRadius:15}}>
              {tokens.map((token, index)=>{
                token.address = currentAddress;
                return (
                  <TouchableOpacity key={index} style={{flexDirection:'row'}} onPress={()=>this.moveDetail(token)}>
                    <View style={{flex:1}}>
                      <View style={{height:1, backgroundColor:'rgb(230,230,230)'}}/>
                      <View style={{height:64, alignItems: 'center', flexDirection:'row'}}>
                        <View style={{width:16, height:16, marginLeft:16, borderRadius:90, backgroundColor:'rgb(191,191,191)'}}/>
                        <Text style={{marginLeft:12, flex:1, color:'rgb(74,74,74)', fontSize:18, fontWeight:'bold'}}>{token.symbol}</Text>
                        <View style={{marginRight:16, alignItems:'flex-end'}}>
                          <Text style={{fontSize:18, color:'rgb(128,128,128)'}}>{token.amount}</Text>
                          <Text style={{fontSize:10, color:'rgb(128,128,128)'}}>{token.value}</Text>
                        </View>
                      </View>

                    </View>
                  </TouchableOpacity>);
              })}
              <View style={{flex:1}}/>
              <View style={{flexDirection:'row', marginBottom:14, justifyContent:'center'}}>
              <Text style={{fontSize:16, color:'rgb(155,155,155)', textDecorationLine: 'underline'}}>Edit Tokens</Text>
              </View>
            </View>
          </View>


        </View>

      </LinearGradient>
    );
  }
}
