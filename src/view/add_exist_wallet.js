import React, { Component } from 'react'
import { View,  TouchableOpacity, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class AddExistWallet extends Component {

  constructor(props) {
    super(props);
    this.state = { words: 'input' };
  }

  importFromPrivateKey(){
    this.props.navigation.navigate('FindWalletPrivateKey');
  }

  importFromSecretWords(){
    this.props.navigation.navigate('FindWalletWords');
  }

  backNavigation(){
    console.log(this.props.navigation);
    this.props.navigation.pop();
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor:'white'}}>
        <TouchableOpacity style={{marginLeft:14, marginTop:25, width:100, height:44}} onPress={()=>this.backNavigation()}>
          <Image source={require('../../assets/btnCommonX44Pt.png')}/>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize:22, fontWeight:'bold', color:'black', marginTop:54}}>Add Wallet</Text>
          <Text style={{fontSize:16, color:'rgb(155,155,155)', marginTop:20}}>Please select method to import your wallet</Text>
          <View style={{backgroundColor:'red', height:202, width:324, marginTop:30, borderRadius:12}}/>

        </View>
        <View style={{marginBottom:47, alignItems: 'center'}}>
          <TouchableOpacity onPress={()=>this.importFromPrivateKey()} >
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#5da7dc', '#306eb6']} style={{justifyContent: 'center',alignItems: 'center', borderRadius:12, marginBottom:17,  width:330, height:58}}>
            <Text style={{color:'white', fontSize:20, fontWeight:'bold'}} >Private Key</Text>
          </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.importFromSecretWords()} >
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#5da7dc', '#306eb6']} style={{justifyContent: 'center',alignItems: 'center', borderRadius:12, width:330, height:58}}>
            <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>12 Words</Text>
          </LinearGradient>
          </TouchableOpacity>
        </View>


      </View>
    );
  }
}
