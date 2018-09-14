import { observable, autorun, action } from 'mobx'
import { firebaseApp } from '../firebase'

class AppStore {
  @observable uid = null;
  @observable username = null;
  @observable wallet = null;
  init(user){
    this.uid = user;
    this.wallet = null;
    this.walletLoading = false;
    console.log('init User:'+this.uid);
    this.loadUserData()
  }

  @action
  loadUserData () {
    this.loadWallet();
  }

  @action
  loadWallet() {
    if(this.wallet){
      console.log('already wallet is loaded!');
    }
    else{
      firebaseApp.database().ref('/wallets/'+this.uid).on('value', (snap)=>{this.onloadWalletComplete(snap)});
    }
  }

  @action.bound
  onloadWalletComplete(snapshot){
    if(snapshot.val()){
      this.wallet = snapshot.val();
    }
    else{
      console.log('wallet is not created');
    }
    this.walletLoading = true;

  }


}

const appStore = new AppStore();

export default appStore
