import React, { Component } from 'react'
import { View,  Button, Text, ActivityIndicator, Clipboard,TouchableOpacity, Image} from 'react-native';
import { action } from 'mobx'
import { observer, inject } from 'mobx-react/native'
import Toast, {DURATION} from 'react-native-easy-toast'

import LinearGradient from 'react-native-linear-gradient';


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

    this.props.appStore.obtainNewAccount(this.accountObtained);
  }

  @action.bound
  accountObtained(account){
    console.log(account);
    this.setState({address:account.address, privateKey:account.privateKey, mnemonic:account.mnemonic, isProcessing:false});
  }

  moveToVerify(){
    this.props.navigation.navigate('VerifySecret', {address:this.state.address, privateKey:this.state.privateKey, mnemonic:this.state.mnemonic});
  }

  copyWords(){
    if(this.state.mnemonic == ''){
      this.refs.toast.show('Please wait..', DURATION.LENGTH_SHORT);
      return;
    }
    this.writeToClipboard();

  }

  backNavigation(){
    this.props.navigation.pop();
  }

  writeToClipboard = async () => {
    await Clipboard.setString(this.state.mnemonic);
    this.refs.toast.show('copied to clipboard', DURATION.LENGTH_SHORT);
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor:'white'}}>
        <TouchableOpacity style={{marginLeft:14, marginTop:25, width:100, height:44}} onPress={()=>this.backNavigation()}>
          <Image source={require('../../assets/btnCommonX44Pt.png')}/>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'white' }}>
          <Text style={{marginTop:60, fontSize:22, color:'black', fontWeight:'bold'}}>Backup Phrase</Text>
          <Text style={{marginTop:20, marginLeft:26, marginRight:26, fontSize:16, textAlign:'center', color:'rgb(155,155,155)'}}> These 12 words are the only way to restore your Trust wallet. save them somewhere safe and secret</Text>

          <View style={{borderRadius:5, borderWidth:1, borderColor:'rgb(220,220,220)', backgroundColor:'rgb(243,243,243)', width:330, paddingTop:10, paddingBottom:10, paddingLeft:31, paddingRight:31, marginTop:158}}>
            <Text style={{fontSize:16, textAlign:'center', color:'rgb(154,154,154)'}}> {this.state.mnemonic} </Text>
            {(this.state.isProcessing)?(<ActivityIndicator/>):null}
          </View>

          {(!this.state.isProcessing)?(<Text style={{marginTop:26, fontSize:16, color:'rgb(47,109,182)' }} onPress={()=>this.copyWords()}>Copy Text</Text>):null}
        </View>

        <View style={{flexDirection:'row'}}>
          {(!this.state.isProcessing)?(<TouchableOpacity onPress={()=>this.moveToVerify()} style={{flex:1, alignItems:'center'}}><LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#5da7dc', '#306eb6']} style={{justifyContent: 'center',alignItems: 'center', borderRadius:12, marginBottom:38, backgroundColor:'rgb(48,110,182)',  width:330, height:58}}>
            <Text style={{color:'white', fontSize:20, fontWeight:'bold'}} >Next</Text>
          </LinearGradient></TouchableOpacity>):null}
        </View>


        <Toast ref="toast"/>
      </View>
    );
  }
}
