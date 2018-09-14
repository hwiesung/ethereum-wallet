import { observable, autorun, action } from 'mobx'
import { firebaseApp } from '../firebase'

class AppStore {
  @observable uid = null;
  @observable username = null;

  init(uid){
    this.uid = uid;

    console.log('init User:'+this.uid);
  }

}

const appStore = new AppStore();

export default appStore
