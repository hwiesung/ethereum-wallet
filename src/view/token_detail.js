import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity} from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import axios from 'axios';
import { observer, inject } from 'mobx-react/native'
import { action } from 'mobx'
import LinearGradient from 'react-native-linear-gradient';

@inject("appStore") @observer
export default class TokenDetail extends Component {
  constructor() {
    super();
    this.state = {
      isProcessing : false,
      privateKey:'',
      coin: 'ETH',
      tokens:[]
    };
  }

  componentDidMount(){
    console.log(DefaultPreference.get('privateKey').then((value)=>{
      this.setState({privateKey:value});
    }));

    let tokens = [];
    tokens.push({name:'ETH', amount:'300', value:'30,000 USD'});
    tokens.push({name:'AIN', amount:'100', value:'100 USD'});
    tokens.push({name:'AFAN', amount:'500', value:'3,000 USD'});
    this.setState({tokens:tokens});
  }

  moveDetail(index){
    console.log(index);
  }


  render() {
    let address = (this.props.appStore && this.props.appStore.walletInit) ? this.props.appStore.wallet.address : '';
    return (
      <LinearGradient colors={['#5da7dc', '#306eb6']} style={{ flex:1, alignItems: 'center'}}>
        <View style={{flex:1, marginTop:79, marginLeft:13, marginRight:13, marginBottom:18, flexDirection:'row', borderRadius:15, backgroundColor:'white'}}>
          <View style={{flex:1}}>
            <Text style={{marginLeft:21, marginTop:21, fontSize:26, color:'rgb(74,74,74)', fontWeight:'bold'}}>{this.state.coin} Wallet</Text>
            <View style={{marginTop:21, flexDirection:'row'}}>
              <Text style={{flex:1, marginLeft:30, fontSize:12, color:'rgb(48,110,182)'}}>{address}</Text>
              <Image style={{marginLeft:18, marginRight:30, marginTop:4}} source={require('../../assets/btnDepositQrBig.png')}/>
            </View>
            <View style={{flexDirection:'row', height:4, marginTop:8, marginLeft:18, marginRight:18, backgroundColor:'rgb(37,72,143)'}}/>
            <View style={{flex:1, backgroundColor:'rgb(240,240,240)', marginTop:16, borderBottomLeftRadius:15, borderBottomRightRadius:15}}>
              {this.state.tokens.map((token, index)=>{
                return (
                  <TouchableOpacity key={index} style={{flexDirection:'row'}} onPress={()=>this.moveDetail('a')}>
                    <View style={{flex:1}}>
                      <View style={{height:1, backgroundColor:'rgb(230,230,230)'}}/>
                      <View style={{height:64, alignItems: 'center', flexDirection:'row'}}>
                        <View style={{width:16, height:16, marginLeft:16, borderRadius:90, backgroundColor:'rgb(191,191,191)'}}/>
                        <Text style={{marginLeft:12, flex:1, color:'rgb(74,74,74)', fontSize:18, fontWeight:'bold'}}>{token.name}</Text>
                        <View style={{marginRight:16, alignItems:'flex-end'}}>
                          <Text style={{fontSize:18, color:'rgb(128,128,128)'}}>{token.amount}</Text>
                          <Text style={{fontSize:10, color:'rgb(128,128,128)'}}>{token.value}</Text>
                        </View>
                      </View>

                    </View>
                  </TouchableOpacity>);
              })}
              <View style={{flex:1}}/>
              <View style={{flexDirection:'row', marginBottom:14, justifyContent:'center'}}>
                <Text style={{fontSize:16, color:'rgb(155,155,155)', textDecorationLine: 'underline'}}>Edit Tokens</Text>
              </View>
            </View>
          </View>


        </View>

      </LinearGradient>
    );
  }
}
