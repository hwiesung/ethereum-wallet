import { observable, autorun, action } from 'mobx'
import { firebaseApp } from '../firebase'
import axios from 'axios';
const moment = require('moment');
var bip39 = require('bip39');
var hdkey = require('ethereumjs-wallet-react-native/hdkey');
import DefaultPreference from 'react-native-default-preference';
import Config from 'react-native-config'
import {Clipboard} from "react-native";
const tokenABI = require('../constants/tokenABI');
const instance = axios.create({
  baseURL: Config.WALLET_API_URL,
  timeout: 180000,
  headers: {'Content-Type':'application/json'}
});
var Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider(Config.INFURA_URL));

const wallet_hdpath = "m/44'/60'/0'/0/";

class AppStore {
  @observable uid = null;
  @observable user = null;
  @observable username = null;
  @observable wallet = null;
  @observable walletInit = false;
  @observable price = null;
  @observable selectedWallet = null;
  @observable orderBook = null;
  @observable orderBookInit = null;
  @observable tokens = null;
  @observable localWallets = null;
  @observable transactions = null;
  init(user){
    this.uid = user;
    this.user = null;
    this.wallet = null;
    this.localWallets = null;
    this.price = null;
    this.transactions = null;
    this.tokens = null;
    this.orderBook = null;
    this.userInit= false;
    this.priceInit = false;
    this.walletInit = false;
    this.transactionInit = false;
    this.orderBookInit = null;
    this.selectedWallet = 0;
    this.contracts = {};
    console.log('init User:'+this.uid);
    this.loadData()
  }


  @action
  loadData () {
    this.loadLocalWallet();
    this.loadUserInfo();
    this.loadWallet();
    this.loadPrice();
    this.loadToken();
    this.loadTransactions();
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
  selectWallet(index, callback) {
    this.selectedWallet  = index;

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
  loadToken() {
    if(this.tokens){
      console.log('already tokens are loaded!');
    }
    else{
      console.log('request get token');
      firebaseApp.database().ref('/token').on('value', (snap)=>{this.onLoadTokenComplete(snap)});
    }
  }

  @action.bound
  onLoadTokenComplete(snapshot){
    if(snapshot.val()){
      console.log('tokens');
      this.tokens = snapshot.val();
      console.log('token loaded');
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
  saveWallet(coin, wallet, privateKey, mnemonic, callback) {
    let index = Object.keys(this.localWallets).length;
    let name = coin +(index>0?index+1:'')  + ' Wallet';
    let newWallet = {index:index, address:wallet.address, privateKey:privateKey, isImported:wallet.isImported, mnemonic:mnemonic, name:name};

    wallet.name =name;
    wallet.index = index;

    firebaseApp.database().ref('/wallets/'+this.uid+'/'+coin+'/'+wallet.address).set(wallet).then((err)=> {
      if(err){
        console.log('create wallet err');
        console.log(err);
      }
      else{
        this.localWallets[wallet.address] = newWallet;
        console.log('before save wallet');
        console.log(this.localWallets);
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
        return DefaultPreference.set('wallets', result).then(()=>{
          console.log('local wallet saved');
          callback(wallet.address);
        });
      }
    });
  }

  @action
  requestOrderBookSync() {
    let before1min = moment().subtract(1, 'minute').utc().valueOf();
    if(this.orderBookInit) {
      let items = this.orderBookInit.split('/');
      const coin = items[1];
      const token = items[0];
      firebaseApp.database().ref('/orders/'+coin+'/'+token).once('value').then((snap)=>{
        let orders = snap.val();
        console.log(orders);
        if(orders && orders.update_time < before1min){
          console.log('request orders sync:'+orders.update_time);
          firebaseApp.database().ref('/sync/'+this.uid+'/'+coin+'/0x0/orders/'+token).set(orders.lastBlockNumber);
        }
      });
    }

  }


  @action
  requestBalanceSync(coin, address) {
    let before1min = moment().subtract(1, 'minute').utc().valueOf();
    if(this.wallet[coin][address].balance.update_time < before1min){
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
  requestTranactionSync(coin, contract, symbol, address) {
    let before1min = moment().subtract(1, 'minute').utc().valueOf();
    let updateTime = 0;
    console.log(this.transactions);
    if(coin === symbol){
      updateTime = this.transactions[coin][address].update_time;
    }
    else{
      if(this.transactions[coin][address] && this.transactions[coin][address].token && this.transactions[coin][address].token[contract]){
        updateTime = this.transactions[coin][address].token[contract].update_time;
      }
    }
    console.log(updateTime);
    if (updateTime < before1min) {
      console.log('request sync transactions:'+symbol);
      if(coin === symbol){
        firebaseApp.database().ref('/sync/' + this.uid + '/'+coin+'/'+address+'/transactions').set(this.transactions[coin][address].lastBlockNumber);
      }
      else{
        console.log(this.transactions[coin][address]);
        let lastBlockNumber = (this.transactions[coin][address] && this.transactions[coin][address].token && this.transactions[coin][address].token[contract])?this.transactions[coin][address].token[contract].lastBlockNumber : 0;
        console.log(lastBlockNumber);
        firebaseApp.database().ref('/sync/' + this.uid + '/'+coin+'/'+address+'/token/'+contract).set(lastBlockNumber);
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
  loadOrderBook(coin, token) {
    if(this.orderBookInit) {
      let items = this.orderBookInit.split('/');
      firebaseApp.database().ref('/order_book/'+items[1]+'/'+items[0]).off();
    }

    firebaseApp.database().ref('/order_book/'+coin+'/'+token).on('value', (snap)=>{this.onLoadOrderBookComplete(snap, token+'/'+coin)});
  }

  @action.bound
  onLoadOrderBookComplete(snapshot, market) {
    if (snapshot.val()) {
      console.log('orderbook loaded:'+market);
      this.orderBook = snapshot.val();
      this.orderBookInit = market;
    }
    else {
      console.log('there is no orderBook');
    }
  }

  getCurrentBlockNumber = async () => {
    const currentBlockNumber = await web3.eth.getBlockNumber();

    console.log(currentBlockNumber);
    return currentBlockNumber;
  };

  @action
  sendTransaction(params, callback) {
    var rawTransaction = {
      "from": params.from,
      "to": params.to,
      "value": web3.utils.toHex(web3.utils.toWei(params.amount, "ether")),
      "gas": web3.utils.toHex(30000),
      "gasPrice":web3.utils.toHex(web3.utils.toWei("50","gwei"))
    };
    console.log(rawTransaction);
    console.log(params.privateKey);
    web3.eth.accounts.signTransaction(rawTransaction, params.privateKey).then((signedTx)=>{
      console.log(signedTx);
      return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }).then((receipt)=>{
      callback(true, receipt);
    }).catch((err)=>{
      console.log(err);
      callback(false);
    });
  }

  @action
  transferToken(params, callback) {
    let contract = this.contracts[params.contract];
    if(!contract){
      contract = new web3.eth.Contract(tokenABI, params.contract);
    }

    console.log(params);

    const value = web3.utils.toWei(params.amount, 'ether');
    console.log(value);
    let data = contract.methods.transfer(params.to, value ).encodeABI();
    console.log(data);
    let rawTx = {
      "gasLimit": web3.utils.toHex(90000),
      "to": params.contract,
      "value": "0x00",
      "data": data,
    };

    console.log(rawTx);

    web3.eth.accounts.signTransaction(rawTx, params.privateKey).then((signedTx)=>{
      console.log(signedTx);
      return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }).then((receipt)=>{
      console.log(receipt);
      callback(true, receipt);
    }).catch((err)=>{
      console.log(err);
      callback(false);
    });
  }

  @action
  obtainTradeHistory(coin, token, address, callback) {  // 0:incomplete, 1:complete
    let list = [];
    let actions = [];
    actions.push(firebaseApp.database().ref('/orders/'+coin+'/'+token+'/history').orderByChild('seller').equalTo(address).once('value'));
    actions.push(firebaseApp.database().ref('/orders/'+coin+'/'+token+'/history').orderByChild('buyer').equalTo(address).once('value'));
    return Promise.all(actions).then((results)=>{
      let result = results[0].val();
      if(result){
        for(let hash in result){
          list.push(result[hash]);
        }
      }

      result = results[1].val();
      if(result){
        for(let hash in result){
          result[hash].isBoaught = true;
          list.push(result[hash]);
        }
      }

      callback(list);
    });

  }

  @action
  sellToken(params, callback) {
    params.uid = this.uid;
    console.log(params);
    instance.post('sell_token', params).then( (result)=> {
      if(result.status === 200 && result.data.ret_code === 0){
        callback(true);
      }
      else{
        callback(false);
      }

    }).catch((err)=>{
      callback(false);
    });
  }

  @action
  buyToken(params, callback) {
    params.uid = this.uid;
    console.log('request);')
    instance.post('buy_token', params).then( (result)=> {
      console.log(result);
      if(result.status === 200 && result.data.ret_code === 0){
        callback(params.orderHash, true);
      }
      else{
        callback(params.orderHash, false);
      }

    }).catch((err)=>{
      callback(params.orderHash, false);
    });
  }

  @action
  cancelOrder(params, callback) {
    params.uid = this.uid;
    console.log(params);
    instance.post('cancel_order', params).then( (result)=> {
      if(result.status === 200 && result.data.ret_code === 0){
        callback(params.orderHash,true);
      }
      else{
        callback(params.orderHash, false);
      }

    }).catch((err)=>{
      console.log(err);
      callback(params.orderHash, false);
    });
  }

  @action
  obtainAccountFromPK(privateKey, callback) {
    if(privateKey.indexOf('0x') < 0 ){
      privateKey = '0x'+privateKey;
    }
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    console.log(account);
    callback(account);

  }



  @action
  obtainNewAccount(callback, mnemonic, index){
    if(!mnemonic){
      mnemonic = bip39.generateMnemonic();
    }
    if(!index){
      index = 0;
    }
    const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
    const wallet = hdwallet.derivePath(wallet_hdpath + index).getWallet();

    const address = '0x' + wallet.getAddress().toString('hex').toLowerCase();
    const privateKey = wallet._privKey.toString('hex');

    callback({address:address, privateKey:privateKey, mnemonic:mnemonic});
  }



}

const appStore = new AppStore();

export default appStore
