import React, { Component } from 'react'
import { View,  Button, Text, ActivityIndicator, Clipboard } from 'react-native';

import axios from 'axios';
import { observer, inject } from 'mobx-react/native'
import Toast, {DURATION} from 'react-native-easy-toast'

import DefaultPreference from 'react-native-default-preference';
import LinearGradient from 'react-native-linear-gradient';
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
      isProcessing : true,
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
        this.setState({address:result.data.address, privateKey:result.data.privateKey, encrypted:result.data.encrypted, mnemonic:result.data.mnemonic, isProcessing:false})
      });


    }).catch((err)=>{
      console.log(err);
    });
  }

  moveToVerify(){

  }

  copyWords(){
    if(this.state.mnemonic == ''){
      this.refs.toast.show('Please wait..', DURATION.LENGTH_SHORT);
      return;
    }
    this.writeToClipboard();

  }

  writeToClipboard = async () => {
    await Clipboard.setString(this.state.mnemonic);
    this.refs.toast.show('copied to clipboard', DURATION.LENGTH_SHORT);
  };

  render() {
    if(this.props.appStore.user.init){
      this.props.navigation.navigate('Home');
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor:'white'}}>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'white' }}>
          <Text style={{marginTop:98, fontSize:22, color:'black', fontWeight:'bold'}}>Backup Phrase</Text>
          <Text style={{marginTop:20, marginLeft:26, marginRight:26, fontSize:16, textAlign:'center', color:'rgb(155,155,155)'}}> These 12 words are the only way to restore your Trust wallet. save them somewhere safe and secret</Text>

          <View style={{borderRadius:5, borderWidth:1, borderColor:'rgb(220,220,220)', backgroundColor:'rgb(243,243,243)', width:330, paddingTop:10, paddingBottom:10, paddingLeft:31, paddingRight:31, marginTop:158}}>
            <Text style={{fontSize:16, textAlign:'center', color:'rgb(154,154,154)'}}> {this.state.mnemonic} </Text>
            {(this.state.isProcessing)?(<ActivityIndicator/>):null}
          </View>

          {(!this.state.isProcessing)?(<Text style={{marginTop:26, fontSize:16, color:'rgb(47,109,182)' }} onPress={()=>this.copyWords()}>Copy Text</Text>):null}
        </View>

        {(!this.state.isProcessing)?(<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#5da7dc', '#306eb6']} style={{justifyContent: 'center',alignItems: 'center', borderRadius:12, marginBottom:38, backgroundColor:'rgb(48,110,182)',  width:330, height:58}}>
            <Text style={{color:'white', fontSize:20, fontWeight:'bold'}} onPress={()=>this.moveToVerify()}>Next</Text>
          </LinearGradient>):null}

        <Toast ref="toast"/>
      </View>
    );
  }
}
