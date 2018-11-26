import React, { Component } from 'react'
import { View,  Button, ActivityIndicator, Text} from 'react-native';
import { observer, inject } from 'mobx-react/native'
import { firebaseApp } from '../firebase'
import Toast, {DURATION} from 'react-native-easy-toast'
import LinearGradient from 'react-native-linear-gradient';
const timer = require('react-native-timer');

@inject("appStore") @observer
export default class SplashScreen extends Component {

  constructor() {
    super();

  }

  isLoadComplete(){
    return (this.props.appStore.priceInit && this.props.appStore.walletInit && this.props.appStore.transactionInit && this.props.appStore.localWallets);
  }

  componentWillMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user ) {
        console.log('userStateChanged:'+user.uid);
        const currentUser = firebaseApp.auth().currentUser;
        console.log(currentUser);
        this.props.appStore.init(currentUser.uid);


      }
      else{
        console.log('not user');
        firebaseApp.auth().signInAnonymouslyAndRetrieveData().catch((err)=>{
          if(err){
            this.refs.toast.show('Failed to Login, Please turn on mobile network.', DURATION.LENGTH_SHORT);
          }
        });
      }

    });
  }

  componentDidMount(){
    timer.setInterval(this, 'splash', ()=>{
      console.log('check');
      if(this.props.appStore.user){
        if(this.props.appStore.user.init){
          console.log("user init");
          if(this.isLoadComplete()){
            this.props.navigation.navigate('PinNumber');
          }
        }
        else{
          this.props.navigation.navigate('Login');
        }
      }
    }, 100)
  }

  componentWillUnmount() {
    timer.clearInterval(this);
  }

  render() {
    console.log(this.state);


    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'white' }}>
        <Text>Splash</Text>
        <Toast ref="toast"/>
      </View>

    );
  }
}
