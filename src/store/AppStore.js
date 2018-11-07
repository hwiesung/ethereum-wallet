import { observable, autorun, action } from 'mobx'
import { firebaseApp } from '../firebase'
import axios from 'axios';
const moment = require('moment');
import DefaultPreference from 'react-native-default-preference';

const instance = axios.create({
  baseURL: 'https://us-central1-sonder-6287a.cloudfunctions.net/',
  timeout: 30000,
  headers: {'Content-Type':'application/json'}
});

class AppStore {
  @observable uid = null;
  @observable user = null;
  @observable username = null;
  @observable wallet = null;
  @observable price = null;


  init(user){
    this.uid = user;
    this.user = null;
    this.wallet = null;
    this.localWallets = {};
    this.price = null;
    this.transactions = null;
    this.tradeHistory = null;
    this.orderBook = null;
    this.userInit= false;
    this.priceInit = false;
    this.walletInit = false;
    this.transactionInit = false;
    this.orderBookInit = false;
    this.tradeHistoryInit = false;
    console.log('init User:'+this.uid);
    this.loadData()
  }


  @action
  loadData () {
    this.loadLocalWallet();
    this.loadUserInfo();
    this.loadWallet();
    this.loadPrice();
    this.loadTransactions();
    this.loadOrderBook();
    this.loadTradeHistory();
  }
  @action
  loadLocalWallet() {
    DefaultPreference.get('wallets').then((value)=>{
      console.log("local:"+value);
      let wallets = {};
      if(value){
        let tokens = value.split('&');
        for(let token of tokens){
          let words = token.split('/');
          wallets[words[1]] = {index:parseInt(words[0]), address:words[1], privateKey:words[2]};
        }
      }
      this.localWallets = wallets;
    });
  }

  @action
  loadUserInfo() {
    firebaseApp.database().ref('/users/'+this.uid).on('value', (snap) => {this.onLoadUserInfoComplete(snap)});
  }

  @action.bound
  onLoadUserInfoComplete(snapshot) {
    let me = snapshot.val();
    console.log('get userInfo');
    console.log(me);
    if (me) {
      this.userInit = true;
      this.user = me;
    }
    else {
      console.log('no user info');
      me = { uid:this.uid, init:false};
      firebaseApp.database().ref('/users/' + this.uid).set(me, (err) => {
        if (err) {
          console.log("user add fail");
        }
        else {
          console.log('user added');
        }
      });
    }
  }

  @action
  loadPrice() {
    if(this.price){
      console.log('already price is loaded!');
    }
    else{
      firebaseApp.database().ref('/price').on('value', (snap)=>{this.onLoadPriceComplete(snap)});
    }
  }

  @action.bound
  onLoadPriceComplete(snapshot){
    if(snapshot.val()){
      this.price = snapshot.val();
      this.priceInit = true;
      console.log('price loaded');
    }
  }

  @action
  loadWallet() {
    if(this.wallet){
      console.log('already wallet is loaded!');
    }
    else{
      firebaseApp.database().ref('/wallets/'+this.uid).on('value', (snap)=>{this.onLoadWalletComplete(snap)});
    }
  }

  @action.bound
  onLoadWalletComplete(snapshot){
    if(snapshot.val()){
      this.wallet = snapshot.val();
      this.walletInit = true;
      console.log('wallet loaded');
    }
    else{
      console.log('wallet is not created');
    }

  }

  @action
  saveWallet(coin, wallet, privateKey, callback) {

    let index = Object.keys(this.localWallets).length;
    let name = coin +(index>0?index+1:'')  + ' Wallet';
    let newWallet = {index:index, address:wallet.address, privateKey:privateKey};
    wallet.name =name;
    wallet.index = index;
    firebaseApp.database().ref('/wallets/'+this.uid+'/'+coin+'/'+wallet.address).set(wallet, (err)=>{
      if(err){
        console.log('create wallet err');
        console.log(err);
      }
      else{

        this.localWallets[wallet.address] = newWallet;
        console.log('before save wallet');
        console.log(this.localWallets);
        this.saveLocalWallet().then(()=>{
          callback(wallet.address);
        });

      }
    });
  }

  @action.bound
  saveLocalWallet(){
    let result = '';
    for(let address in this.localWallets){
      let wallet = this.localWallets[address];
      let str = wallet.index+'/'+wallet.address+'/'+wallet.privateKey;
      if(result){
        result = result +'&'+str;
      }
      else{
        result = str;
      }
    }
    console.log(result);
    return DefaultPreference.set('wallets', result);
  }

  @action
  requestBalanceSync(coin, address) {
    let before1min = moment().subtract(1, 'minute').utc().valueOf();
    if(this.wallet.update_time < before1min){
      firebaseApp.database().ref('/sync/'+this.uid+'/'+coin+'/'+address+'/balance').set(true);
    }
  }

  @action
  requestPriceSync(coin) {
    let before1min = moment().subtract(1, 'minute').utc().valueOf();
    if(this.price[coin].update_time < before1min){
      firebaseApp.database().ref('/sync/'+this.uid+ '/'+coin+'/price').set(true);
    }
  }

  @action
  requestTradeHistorySync(coin, token, address) {
    let before1min = moment().subtract(1, 'minute').utc().valueOf();
    let lastUpdate = (this.tradeHistory && this.tradeHistory[coin] && this.tradeHistory[coin][token])? this.tradeHistory[coin][token].update_time : 0;
    let start = (this.tradeHistory && this.tradeHistory[coin] && this.tradeHistory[coin][token])? this.tradeHistory[coin][token].start : 0;
    if(lastUpdate< before1min){
      firebaseApp.database().ref('/sync/'+this.uid+ '/'+coin+'/'+address+'/'+token+'/trade_history').set(start);
    }
  }


  @action
  requestTranactionSync(coin, token, address) {
    let before1min = moment().subtract(1, 'minute').utc().valueOf();
    let updateTime = 0;
    if(coin === token){
      updateTime = this.transactions[coin][address].update_time;
    }
    else{
      updateTime = this.transactions[coin][address].token[token].update_time;
    }
    if (updateTime < before1min) {
      console.log('request sync transactions:'+token);
      if(coin === token){
        firebaseApp.database().ref('/sync/' + this.uid + '/'+coin+'/'+address+'/transactions').set(this.transactions[coin][address].lastBlockNumber);
      }
      else{
        firebaseApp.database().ref('/sync/' + this.uid + '/'+coin+'/'+address+'/token/'+token).set(this.transactions[coin][address].token[token].lastBlockNumber);
      }
    }
  }



  @action
  loadTransactions() {
    if(this.transactionInit){
      console.log('already transaction is loaded!');
    }
    else{
      console.log('watch trans');
      firebaseApp.database().ref('/transaction_history/'+this.uid).on('value', (snap)=>{this.onLoadTransactionComplete(snap)});
    }
  }

  @action.bound
  onLoadTransactionComplete(snapshot) {
    if (snapshot.val()) {
      console.log('transaction updated');
      this.transactions = snapshot.val();
      this.transactionInit = true;
    }
    else {
      console.log('there is no transactions');
    }
  }


  @action
  loadTradeHistory() {
    if(this.tradeHistoryInit){
      console.log('already trade history is loaded!');
    }
    else{
      firebaseApp.database().ref('/trade_history/'+this.uid).on('value', (snap)=>{this.onLoadTradeHistoryComplete(snap)});
    }
  }

  @action.bound
  onLoadTradeHistoryComplete(snapshot) {
    if (snapshot.val()) {
      console.log('trade updated');
      this.tradeHistory = snapshot.val();
      this.tradeHistoryInit = true;
    }
    else {
      console.log('there is no history');
    }
  }

  @action
  loadOrderBook() {
    if(this.orderBookInit){
      console.log('already orderBook is loaded!');
    }
    else{
      console.log('watch orderbook');
      firebaseApp.database().ref('/order_book').on('value', (snap)=>{this.onLoadOrderBookComplete(snap)});
    }
  }

  @action.bound
  onLoadOrderBookComplete(snapshot) {
    if (snapshot.val()) {
      this.orderBook = snapshot.val();
      this.orderBookInit = true;
    }
    else {
      console.log('there is no orderBook');
    }
  }

  @action
  sendTransaction(params, callback) {
    params.uid = this.uid;
    instance.post('send_transaction', params).then( (result)=> {
      console.log(result.data);
      callback();
    });
  }

  @action
  transferToken(params, callback) {
    params.uid = this.uid;
    instance.post('transfer_token', params).then( (result)=> {
      console.log(result.data);
      callback();
    });
  }


}

const appStore = new AppStore();

export default appStore
