import React, { Component } from 'react'
import { View,  Button, Text, TextInput,TouchableOpacity, Image } from 'react-native';
import {firebaseApp} from "../firebase";
import LinearGradient from 'react-native-linear-gradient';

const WORDS_LENGTH=12;

export default class FindWalletFromWords extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      complete: true
    };
  }

  backNavigation(){
    console.log(this.props.navigation);
    this.props.navigation.pop();
  }

  inputText(text){
    let alphaExp = /^[a-zA-Z\s]+$/;
    if(text.length > 0){
      let available = text.match(alphaExp);
      if(available){
        text = text.toLowerCase();
      }
      else{
        return;
      }
    }
    let complete = false;

    this.setState({value:text,complete:complete});
  }

  findWallet(){

  }

  render() {
    let btnColor = (this.state.complete)? ['#5da7dc', '#306eb6']: ['#dbdbdb','#b5b5b5'];

    return (
      <View style={{ flex: 1, backgroundColor:'white'}}>
        <TouchableOpacity style={{marginLeft:14, marginTop:25, width:100, height:44}} onPress={()=>this.backNavigation()}>
          <Image source={require('../../assets/btnCommonX44Pt.png')}/>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize:22, fontWeight:'bold', color:'black', marginTop:54}}>Add Wallet</Text>
          <Text style={{fontSize:16, color:'rgb(155,155,155)', marginTop:20}}>Please select method to import your wallet</Text>
          <View style={{height:126, width:324, backgroundColor:'rgb(243,243,243)', padding:12, marginTop:77}}>
            <TextInput style={{borderWidth:0, fontSize:16}} value={this.state.value} placeholder={'Input Secret Words'} multiline={true} underlineColorAndroid={'transparent'}
                       onChangeText={(text)=>this.inputText(text)} />

          </View>


        </View>


        <View style={{marginBottom:47, alignItems: 'center'}}>
          <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={btnColor} style={{justifyContent: 'center',alignItems: 'center', borderRadius:12, width:330, height:58}}>
            <Text style={{color:'white', fontSize:20, fontWeight:'bold'}} onPress={()=>this.findWallet()}>Connect</Text>
          </LinearGradient>
        </View>

      </View>
    );
  }
}
