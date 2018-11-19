import React, { Component } from 'react'
import {View, Text, Image, TouchableOpacity, ActivityIndicator, TextInput, ListView, AppState} from 'react-native';
import { observer, inject } from 'mobx-react/native'
import { action } from 'mobx'
import LinearGradient from 'react-native-linear-gradient';
import DefaultPreference from "react-native-default-preference";
var numeral = require('numeral');
import Toast, {DURATION} from 'react-native-easy-toast'
const timer = require('react-native-timer');

@inject("appStore") @observer
export default class TradeScreen extends Component {
  constructor() {
    super();
    this.state = {
      privateKey: '',
      market: 'FANCO/ETH',
      pay:'ETH',
      token:'FANCO',
      address:'',
      price:'',
      amount:'',
      isProcessing:{},
      appState: AppState.currentState
    };
  }
  componentDidMount(){
    console.log('trade mount');
    DefaultPreference.get('wallets').then((value)=>{
      let wallets = [];
      if(value){
        let tokens = value.split('/');
        this.setState({address:tokens[1]});
      }
    });
    this.requestSync();
    AppState.addEventListener('change', this.handleAppStateChange);

    this._navListener = this.props.navigation.addListener('willFocus', (route) => {
      this.requestSync();
    });

    this.props.appStore.loadOrderBook(this.state.pay, this.state.token);
  }


  componentWillUnmount(){
    AppState.removeEventListener('change', this.handleAppStateChange);
    this._navListener.remove();
  }


  handleAppStateChange = (nextAppState) => {

    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      this.requestSync();
    }
    this.setState({appState: nextAppState});
  }

  changeMarket(){

  }

  moveHistory(){
    this.props.navigation.navigate('TradeHistory', {token:this.state.token, coin:this.state.pay});
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
    let wallet = (this.props.appStore && this.props.appStore.walletInit && this.props.appStore.wallet[this.state.pay][this.state.address]) ? this.props.appStore.wallet[this.state.pay][this.state.address] : {};
    return wallet.balance ? parseFloat(wallet.balance.value): 0;
  }

  getTokenAmount(){
    let wallet = (this.props.appStore && this.props.appStore.walletInit && this.props.appStore.wallet[this.state.pay][this.state.address]) ? this.props.appStore.wallet[this.state.pay][this.state.address] : {};
    return wallet.token && wallet.token[this.state.token] ? wallet.token[this.state.token].value : 0;
  }


  setMaxAmount(){
    let price = this.state.price ? this.state.price : this.getCurrentPrice();
    let max = this.getTokenAmount();

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

  getCurrentWallet(){
    let localWallets = this.props.appStore ?this.props.appStore.localWallets : {};
    let selected = this.props.appStore ? this.props.appStore.selectedWallet : 0;
    let currentWallet = null;
    for( let address in localWallets ){
      let wallet = localWallets[address];
      if(wallet.index == selected){
        currentWallet = wallet;
        break;
      }
    }
    return currentWallet;
  }

  requestSell(){
    const total = this.getAmount() * this.getPrice();
    if(this.getAmount() < 1 || total < 0.05 ){
      console.log('a');
      this.refs.toast.show('please order over 0.05 ETH ', DURATION.LENGTH_SHORT);
      return;
    }
    if(total > 10){
      this.refs.toast.show('please order less 10 ETH ', DURATION.LENGTH_SHORT);
      return;
    }


    let currentWallet = this.getCurrentWallet();

    if(currentWallet){
      let order = {address:currentWallet.address, privateKey:currentWallet.privateKey, token:this.state.token, amount:this.getAmount()+'', price:this.getPrice()+''};
      this.props.appStore.sellToken(order, this.orderAdded);

      let processing = {};
      Object.assign(processing,this.state.isProcessing);
      processing['sell'] = true;
      this.setState({isProcessing:processing});
    }
  }

  requestBuy(item){
    if(this.getCoinAmount() <= item.total){
      this.refs.toast.show('Not enough ETH', DURATION.LENGTH_SHORT);
      return;
    }

    let currentWallet = this.getCurrentWallet();

    if(currentWallet){
      let order = {address:currentWallet.address, privateKey:currentWallet.privateKey, token:this.state.token, seller:item.seller, orderHash:item.orderHash, amount:item.amount+'', price:item.price+'', nonce:item.nonce+'', expire:item.expire+'', total:item.total+''};
      this.props.appStore.buyToken(order, this.tokenBought);

      let processing = {};
      Object.assign(processing,this.state.isProcessing);
      processing[item.orderHash] = true;
      this.setState({isProcessing:processing});

    }

  }

  @action.bound
  orderAdded(success){
    if(success){
      this.setState({price:'', amount:''});
      this.refs.toast.show('Success', DURATION.LENGTH_SHORT);
    }
    else{
      this.refs.toast.show('Request is failed. please try again.', DURATION.LENGTH_SHORT);
    }
    let processing = {};
    Object.assign(processing,this.state.isProcessing);
    processing['sell'] = false;
    this.setState({isProcessing:processing});

  }

  @action.bound
  tokenBought(orderHash, success){
    console.log(orderHash+','+success);
    if(success){
      this.refs.toast.show('Success', DURATION.LENGTH_SHORT);
    }
    else{
      this.refs.toast.show('Request is failed. please try again.', DURATION.LENGTH_SHORT);
    }

    let processing = {};
    Object.assign(processing, this.state.isProcessing);
    processing[orderHash] = false;
    this.setState({isProcessing:processing});
  }

  requestSync(){

  }


  render() {
    let price = (this.props.appStore && this.props.appStore.priceInit) ? this.props.appStore.price : {};
    let diff = price[this.state.pay] ? price[this.state.pay][this.state.token].percentChange : 0;
    let orderBook = (this.props.appStore && this.props.appStore.orderBookInit) ? this.props.appStore.orderBook : null;
    let asks = [];
    let askMax = 0;
    console.log(orderBook);
    if(orderBook){
      for(let hash in orderBook){
        let order = orderBook[hash];
        if(order.price < (1/Math.pow(10,5))){
          order.priceFormated = numeral(order.price).format('0.00000e+0');
        }
        else{
          order.priceFormated = numeral(order.price).format('0,0.000000');
        }

        if(order.amount > (Math.pow(10,5))){
          order.amountFormmated = numeral(order.amount).format('0.00000e+0');
        }
        else{
          order.amountFormmated = numeral(order.amount).format('0,0.0');
        }

        if(order.total > (Math.pow(10,5))){
          order.totalFormmated = numeral(order.total).format('0.00000e+0');
        }
        else{
          order.totalFormmated = numeral(order.total).format('0,0.00');
        }

        if(askMax < parseFloat(order.amount)){
          askMax = parseFloat(order.amount);
        }

        asks.push(order);
      }
    }

    if(asks.length>0){
      asks.sort((a,b)=>{return parseFloat(b.total) - parseFloat(a.total)});
    }

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.orderHash !== r2.orderHash});
    let dataSource = ds.cloneWithRows(asks);


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

            <Text style={{marginTop:20, fontSize:14, color:'rgb(95,173,4)'}}>
              {this.getCurrentPrice()} / {numeral(diff).format('0,0.000')}%
            </Text>
            <View style={{flexDirection:'row', alignItems:'flex-end'}}>
              <Text style={{fontSize:16, color:'rgb(155,155,155)'}}>Assets</Text>
              <Text style={{fontSize:24, marginLeft:8, marginRight:8, fontWeight:'bold', color:'rgb(4,4,4)'}}>{numeral(this.getTokenAmount()).format('0,0.0000')}</Text>
              <Text style={{fontSize:16, color:'rgb(155,155,155)'}}>{this.state.token}</Text>
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

            {!this.state.isProcessing['sell']?(<TouchableOpacity onPress={()=>this.requestSell()} style={{width:200, marginTop:8, marginBottom:17, justifyContent:'center', alignItems:'center', borderRadius:24, height:40, backgroundColor:'rgb(182,0,100)'}}>
              <Text style={{fontSize:18, color:'white', fontWeight:'bold'}}>
                Sell
              </Text>
            </TouchableOpacity>):(<ActivityIndicator style={{marginTop:8, marginBottom:17,}}/>)}
          </View>
        </View>

        <Toast style={{marginBottom:60}} ref="toast"/>

        <View style={{backgroundColor:'white', flex:1, marginTop:50, flexDirection:'row'}}>
          {asks.length>0?(
          <ListView style={{flex:1}} dataSource={dataSource}
                    renderRow={(rowData) =>{
                      let barSize = (parseFloat(rowData.amount) / askMax) - 0.1;
                      let barWidth = numeral(barSize).format('0%');
                      return <View style={{flexDirection:'row', height:38, alignItems:'center'}}>
                        <View style={{backgroundColor:'rgba(182,0,100,0.1)', height:38, width:barWidth, position:'absolute', top:0, right:0}} />
                        <Text style={{flex:1, marginLeft:20, fontWeight:'bold', fontSize:14, color:'rgb(208,2,27)'}}>
                          {rowData.priceFormated}
                        </Text>
                        <Text style={{marginRight:30}}>
                          {rowData.amountFormmated} {this.state.token}
                        </Text>

                        <Text style={{marginRight:12}}>
                          {rowData.totalFormmated} {this.state.pay}
                        </Text>

                          {!this.state.isProcessing[rowData.orderHash]?(<TouchableOpacity onPress={()=>this.requestBuy(rowData)} style={{width:40, height:24, marginRight:12, justifyContent:'center', alignItems:'center', borderRadius:24,  backgroundColor:'rgb(95,173,4)'}}>
                          <Text style={{fontSize:14, color:'white', fontWeight:'bold'}}>
                            Buy
                          </Text>
                        </TouchableOpacity>):(<ActivityIndicator style={{width:40, marginRight:12}}/>)}
                      </View>
                    }}
          />):null}

        </View>
      </LinearGradient>
    );
  }
}
