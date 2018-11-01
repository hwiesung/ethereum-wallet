import { observable, autorun, action } from 'mobx'
import { firebaseApp } from '../firebase'
import axios from 'axios';
const moment = require('moment');


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
    this.price = null;
    this.transactions = null;
    this.userInit= false;
    this.priceInit = false;
    this.walletInit = false;
    this.transactionInit = false;
    console.log('init User:'+this.uid);
    this.loadData()
  }


  @action
  loadData () {
    this.loadPrice();
    this.loadWallet();
    this.loadTransactions();
    this.loadUserInfo();
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
  saveWallet(address, encrypted, mnemonic, privateKey, callback) {
    let newWallet = {address:address, encrypted:encrypted, mnemonic:mnemonic, privateKey:privateKey};
    firebaseApp.database().ref('/wallets/'+this.uid).set(newWallet, (err)=>{
      if(err){
        console.log('create wallet err');
        console.log(err);
      }
      else{
        console.log('wallet created');
        callback();
      }
    });
  }

  @action
  requestBalanceSync(coin) {
    let before1min = moment().subtract(1, 'minute').utc().valueOf();
    if(this.wallet.update_time < before1min){
      firebaseApp.database().ref('/sync/'+this.uid+'/balance').set(true);
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
  requestTranactionSync(token) {
    let before1min = moment().subtract(1, 'minute').utc().valueOf();
    if (this.transactions[token].update_time < before1min) {
      console.log('request sync transactions:'+token);
      if(token =='ETH'){
        firebaseApp.database().ref('/sync/' + this.uid + '/transactions/'+token).set(this.transactions[token].lastBlockNumber);
      }
      else{
        firebaseApp.database().ref('/sync/' + this.uid + '/token/'+token).set(this.transactions[token].lastBlockNumber);
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
      this.transactions = snapshot.val();
      this.transactionInit = true;
    }
    else {
      console.log('there is no transactions');
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
