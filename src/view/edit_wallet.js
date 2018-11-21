import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, Alert} from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import axios from 'axios';
const moment = require('moment');
import { observer, inject } from 'mobx-react/native'
import { action } from 'mobx'
import LinearGradient from 'react-native-linear-gradient';
var numeral = require('numeral');

@inject("appStore") @observer
export default class EditWallet extends Component {
  constructor() {
    super();

    this.state = {
      coin:'ETH',
      isProcessing : false,
      value:''
    };
  }

  componentDidMount(){
    let wallet = this.props.navigation.getParam('wallet', {});
    this.setState({value:wallet.name});
  }

  backNavigation(){
    this.props.navigation.pop();
  }

  componentWillUnmount() {

  }

  inputText(text){


    this.setState({value:text});
  }

  deleteWallet(){
    Alert.alert(
      'Delete Wallet',
      'Are you delete wallet?',
      [
        {text: 'Close', onPress: () => {}, style: 'cancel'},
        {text: 'Confirm', onPress: () => {

            //request delete
          }},
      ],
      { cancelable: false }
    )
  }


  render() {
    let wallet = this.props.navigation.getParam('wallet', {});

    return (
      <LinearGradient colors={['#5da7dc', '#306eb6']} style={{ flex:1}}>
        <View style={{flexDirection:'row',  marginTop:25, height:30, alignItems:'center'}}>
          <TouchableOpacity style={{marginLeft:13, width:80}} onPress={()=>this.backNavigation()}>
            <Image source={require('../../assets/btnCommonBackShadow.png')}/>
          </TouchableOpacity>
          <Text style={{color:'white', fontSize:20, flex:1, marginRight:80, textAlign:'center'}}>Edit Wallets</Text>
        </View>

        <View style={{flex:1,  marginLeft:13, marginRight:13,  marginTop:45, marginBottom:28}}>
          <View style={{height:204, backgroundColor:'white', borderRadius:15}}>
            <View>
              <TextInput style={{borderWidth:0, marginLeft:18, marginTop:21, fontSize:26, fontWeight:'bold', paddingTop:0, paddingBottom:0, paddingLeft:8, paddingRight:8}} value={this.state.value} maxLength={20} underlineColorAndroid={'transparent'}
                         onChangeText={(text)=>this.inputText(text)} />
            </View>
            <View style={{marginLeft:18, marginTop:14, marginRight:18, backgroundColor:'rgb(155,155,155)', height:2}}/>
            <View style={{flexDirection:'row', marginTop:16, marginLeft:18, marginRight:18}}>
              <Text style={{flex:1, marginRight:20, color:'rgb(48,110,182)', fontSize:12 }}>
                {wallet.address}
              </Text>
              <Image style={{marginRight:14}} source={require('../../assets/btnDepositQrBig.png')}/>
            </View>
            <View style={{marginTop:17, backgroundColor:'rgb(230,230,230)', height:1}}/>
            <TouchableOpacity onPress={()=>this.deleteWallet()} style={{flex:1, alignItems:'center', flexDirection:'row'}}>
              <Text style={{flex:1, fontSize:18, color:'rgb(208,2,27)', textAlign:'center'}}>
                Delete Wallet
              </Text>
            </TouchableOpacity>

          </View>






        </View>

      </LinearGradient>
    );
  }
}
