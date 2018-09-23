import React, { Component } from 'react'
import { View,  Button, ActivityIndicator } from 'react-native';
import { observer, inject } from 'mobx-react/native'
import { firebaseApp } from '../firebase'
import Toast, {DURATION} from 'react-native-easy-toast'


import _ from 'lodash'

@inject("appStore") @observer
export default class CreateWalletScreen extends Component {

  constructor() {
    super();
    this.state = {
      isProcessing : true,
      requestSingIn : false
    };
  }
  componentWillMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user ) {
        console.log('userStateChanged:'+user.uid);
        const currentUser = firebaseApp.auth().currentUser;
        console.log(currentUser);
        this.props.appStore.init(currentUser.uid);

        this.setState({isProcessing:false});


      }
      else{
        console.log('not user');

        this.setState({isProcessing:false})
      }

    });
  }

  componentWillUnmount(){
    console.log('singinPage will unmount');
  }

  createWallet(){
    this.setState({isProcessing:true, requestSingIn:true});
    firebaseApp.auth().signInAnonymouslyAndRetrieveData().catch((err)=>{
      if(err){
        this.setState({isProcessing:false});
        this.refs.toast.show('Failed to Login', DURATION.LENGTH_SHORT);
      }
    })
  }

  moveToFindWallet(){
    this.props.navigation.navigate('FindWallet');
  }


  render() {
    console.log(this.state);
    if(this.props.appStore.user){
      if(this.props.appStore.user.init){
        this.props.navigation.navigate('Home');
      }
      else if(this.state.requestSingIn)
      {
        this.props.navigation.navigate('Secret');
      }
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {(!this.state.isProcessing)?(<Button title="Create Wallet!" onPress={()=>this.createWallet()}/>):null}
        {(!this.state.isProcessing)?(<Button title="Find Wallet!" onPress={()=>this.moveToFindWallet()}/>):null}
        {(this.state.isProcessing)?(<ActivityIndicator/>):null}
        <Toast ref="toast"/>
      </View>
    );
  }
}
