import { observable, autorun, action } from 'mobx'
import { firebaseApp } from '../firebase'

class AppStore {
  @observable uid = null;
  @observable user = null;
  @observable username = null;
  @observable wallet = null;


  init(user){
    this.uid = user;
    this.user = null;
    this.wallet = null;
    this.userInit= false;
    this.walletInit = false;
    console.log('init User:'+this.uid);
    this.loadData()
  }

  @action


  @action
  loadData () {
    this.loadWallet();
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





}

const appStore = new AppStore();

export default appStore
