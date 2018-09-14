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
      isProcessing : false
    };
  }
  componentDidMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('userStateChanged:'+user.uid);
        const currentUser = firebaseApp.auth().currentUser;
        console.log(currentUser);
        this.props.appStore.init(currentUser.uid);

        this.setState({isNewDevice:false});

        if(_.isEmpty(currentUser.displayName)){
          this.props.navigation.navigate('Secret');
        }
        else{
          this.props.navigation.navigate('Home');
        }
      }
      else{
        console.log('not user');

        this.setState({isNewDevice:true})
      }

    });
  }

  createWallet(){
    this.setState({isProcessing:true})
    firebaseApp.auth().signInAnonymouslyAndRetrieveData().catch((err)=>{
      if(err){
        this.setState({isProcessing:false});
        this.refs.toast.show('Failed to Login', DURATION.LENGTH_SHORT);
      }
    })
  }


  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {(this.state.isNewDevice && !this.state.isProcessing)?(<Button title="Create Wallet!" onPress={()=>this.createWallet()}/>):null}
        {(this.state.isProcessing)?(<ActivityIndicator/>):null}
        <Toast ref="toast"/>
      </View>
    );
  }
}
