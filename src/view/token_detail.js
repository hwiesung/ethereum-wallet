import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ListView} from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import axios from 'axios';
const moment = require('moment');
import { observer, inject } from 'mobx-react/native'
import { action } from 'mobx'
import LinearGradient from 'react-native-linear-gradient';

@inject("appStore") @observer
export default class TokenDetail extends Component {
  constructor() {
    super();

    this.state = {
      isProcessing : false
    };
  }

  componentDidMount(){



  }

  backNavigation(){
    console.log(this.props.navigation);
    this.props.navigation.pop();
  }

  moveWithdraw(){

  }



  render() {
    let token = this.props.navigation.getParam('token', {});
    let wallet = (this.props.appStore && this.props.appStore.walletInit) ? this.props.appStore.wallet : {};
    let history = (this.props.appStore && this.props.appStore.transactionInit) ? this.props.appStore.transactions['ETH'].history : [];

    let list = [];

    Object.keys(history).forEach((hashKey)=>{
      list.push(history[hashKey]);
    });

    list.sort((a, b)=>{return  b.timeStamp-a.timeStamp});


    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.hash !== r2.hash});
    let dataSource = ds.cloneWithRows(list);



    return (
      <LinearGradient colors={['#5da7dc', '#306eb6']} style={{ flex:1}}>
        <View style={{flexDirection:'row',  marginTop:25, height:30, alignItems:'center'}}>
          <TouchableOpacity style={{marginLeft:13, width:80}} onPress={()=>this.backNavigation()}>
            <Image source={require('../../assets/btnCommonBackShadow.png')}/>
          </TouchableOpacity>
          <Text style={{color:'white', fontSize:20, flex:1, marginRight:80, textAlign:'center'}}>{token.name}</Text>
        </View>

        <View style={{flex:1, marginTop:25, marginLeft:13, marginRight:13, marginBottom:38, flexDirection:'row', borderRadius:15, backgroundColor:'white'}}>
          <View style={{flex:1, alignItems:'center'}}>
            <Text style={{marginLeft:21, marginTop:18, fontSize:26, color:'rgb(74,74,74)', fontWeight:'bold'}}>{(wallet.balance?wallet.balance[token.symbol].value:0)} {token.symbol}</Text>
            <Text style={{height:40, width:264, marginTop:24, textAlign:'center', fontSize:12, color:'rgb(48,110,182)'}}>{wallet.address}</Text>
            <TouchableOpacity onPress={()=>this.moveWithdraw()}>
              <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#5da7dc', '#306eb6']} style={{justifyContent: 'center',alignItems: 'center', borderRadius:12, marginTop:14, width:270, height:58}}>
              <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>Withdrawal</Text>
            </LinearGradient></TouchableOpacity>
            <View style={{flex:1, flexDirection:'row',marginTop:28, marginBottom:28}}>
              <ListView style={{flex:1}} dataSource={dataSource}
                        renderRow={(rowData) =>
                          <View >
                            <View style={{flex:1, backgroundColor:'rgb(230,230,230)', height:1}}/>
                            <View style={{flexDirection:'row', height:60, alignItems:'center'}}>
                              <Image style={{marginLeft:8}} source={rowData.isSend?require('../../assets/icHistoryDwIn.png'):require('../../assets/icHistoryDwOut.png')}/>
                              <View style={{flex:1, marginLeft:6}} >
                                {rowData.isSend?
                                  (<Text style={{fontSize:14, color:'rgb(181,181,181)', marginBottom:2}}>Deposit</Text>):
                                    <Text style={{fontSize:14, color:'rgb(48,110,182)', marginBottom:2}}>Withdrawal</Text>}

                                <Text style={{fontSize:10, color:'rgb(151,151,151)'}}>{moment(rowData.timeStamp,'X').format()}</Text>
                              </View>
                              <Text style={{fontSize:16, color:'rgb(128,128,128)', fontWeight:'bold', marginRight:12}}>{rowData.value}</Text>
                              <Text style={{fontSize:16, color:'rgb(128,128,128)', marginRight:12}}>{token.symbol}</Text>

                            </View>

                          </View>

                        }/>
            </View>




          </View>


        </View>

      </LinearGradient>
    );
  }
}
