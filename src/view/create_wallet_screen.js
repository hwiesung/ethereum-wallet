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
      isNewDevice : true,
      isProcessing : true
    };
  }
  componentWillMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user ) {
        console.log('userStateChanged:'+user.uid);
        const currentUser = firebaseApp.auth().currentUser;
        console.log(currentUser);
        this.props.appStore.init(currentUser.uid);

        this.setState({isNewDevice:false, isProcessing:true});


      }
      else{
        console.log('not user');

        this.setState({isNewDevice:true, isProcessing:false})
      }

    });
  }

  componentWillUnmount(){
    console.log('singinPage will unmount');
  }

  createWallet(){
    this.setState({isProcessing:true});
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
    if(this.props.appStore.user){
      if(this.props.appStore.user.init){
        this.props.navigation.navigate('Home');
      }
      else
      {
        this.props.navigation.navigate('Secret');
      }
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {(this.state.isNewDevice && !this.state.isProcessing)?(<Button title="Create Wallet!" onPress={()=>this.createWallet()}/>):null}
        {(this.state.isNewDevice && !this.state.isProcessing)?(<Button title="Find Wallet!" onPress={()=>this.moveToFindWallet()}/>):null}
        {(this.state.isProcessing)?(<ActivityIndicator/>):null}
        <Toast ref="toast"/>
      </View>
    );
  }
}
