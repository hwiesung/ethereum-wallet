import React, { Component } from 'react'
import { View,  Button, Text, ActivityIndicator } from 'react-native';

import axios from 'axios';
import { observer, inject } from 'mobx-react/native'
import Toast, {DURATION} from 'react-native-easy-toast'

import DefaultPreference from 'react-native-default-preference';

const instance = axios.create({
  baseURL: 'https://us-central1-sonder-6287a.cloudfunctions.net/',
  timeout: 1000,
  headers: {'Content-Type':'application/json'}
});

@inject("appStore") @observer
export default class CreatePrivateKeyScreen extends Component {

  constructor() {
    super();
    this.state = {
      isProcessing : false,
      address:'',
      privateKey:'',
      encrypted:'',
      mnemonic : ''
    };
  }

  componentDidMount() {

    instance.post('create_wallet', {backupYn:true}).then( (result)=>{
      console.log(result.data);
      console.log(result.data.address);
      DefaultPreference.set('privateKey', result.data.privateKey).then(()=>{
        console.log('pk saved');
        this.setState({address:result.data.address, privateKey:result.data.privateKey, encrypted:result.data.encrypted, mnemonic:result.data.mnemonic})
      });


    }).catch((err)=>{
      console.log(err);
    });


  }
  createWallet(){
    if(this.state.mnemonic == ''){
      this.refs.toast.show('Please wait..', DURATION.LENGTH_SHORT);
      return;
    }
    this.setState({isProcessing:true});
    this.props.appStore.saveWallet(this.state.address, this.state.encrypted, this.state.mnemonic, this.state.privateKey);
  }

  render() {
    if(this.props.appStore.user.init){
      this.props.navigation.navigate('Home');
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text> Write down your secret words</Text>
        <Text> {this.state.mnemonic} </Text>
        {(this.state.isProcessing)?(<ActivityIndicator/>):(<Button title="Done" onPress={()=>this.createWallet()}/>)}
        <Toast ref="toast"/>
      </View>
    );
  }
}
