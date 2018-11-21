import React, { Component } from 'react'
import { View,  Button, Text, ActivityIndicator,TouchableOpacity} from 'react-native';

import axios from 'axios';
import { observer, inject } from 'mobx-react/native';
import { action } from 'mobx'
import Toast, {DURATION} from 'react-native-easy-toast'

import DefaultPreference from 'react-native-default-preference';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationActions, StackActions} from "react-navigation";
const instance = axios.create({
  baseURL: 'https://us-central1-sonder-6287a.cloudfunctions.net/',
  timeout: 1000,
  headers: {'Content-Type':'application/json'}
});
const WORD_SIZE = 12;

@inject("appStore") @observer
export default class VerifySecretWords extends Component {

  constructor() {
    super();

    this.state = {
      isProcessing : false,
      verified:false,
      address:'',
      privateKey:'',
      encrypted:'',
      mnemonic : '',
      origin:[],
      words:[],
      coin:'ETH',
      selected:{}
    };
  }

  componentDidMount() {
    let address = this.props.navigation.getParam('address','');
    let privateKey = this.props.navigation.getParam('privateKey','');
    let encrypted = this.props.navigation.getParam('encrypted','');
    let mnemonic = this.props.navigation.getParam('mnemonic','');
    let origin = mnemonic.split(' ');
    let words = [];
    Object.assign(words, origin);
    this.shuffle(words);
    this.setState({address:address, privateKey:privateKey, encrypted:encrypted, mnemonic:mnemonic, words:words, origin:origin});
  }

  shuffle(words){
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
    return words;
  }

  createWallet(){
    if(!this.state.verified){
      return;
    }

    this.setState({isProcessing:true});

    let newWallet = {address:this.state.address, mnemonic:this.state.mnemonic, encrypted:this.state.encrypted};
    this.props.appStore.saveWallet(this.state.coin, newWallet, this.state.privateKey, this.walletCreated);
  }

  selectWord(word){
    if(!this.state.selected[word]){
      let selected = {};
      Object.assign(selected, this.state.selected);
      selected[word] = true;

      let verified = this.verifyWords(Object.keys(selected));
      this.setState({selected:selected, verified:verified});

    }
  }
  deselectWord(word){
    if(this.state.selected[word]){
      let selected = [];
      Object.assign(selected, this.state.selected);
      delete selected[word];
      this.setState({selected:selected, verified:false});
    }
  }

  verifyWords(target){
    if(target.length == WORD_SIZE){
      console.log(this.state.origin);
      console.log(target);
      for(let index=0;index<WORD_SIZE;index++){
        if(this.state.origin[index] != target[index]){
          return false;
        }
      }

      return true;
    }

    return false;
  }

  @action.bound
  walletCreated(){
    console.log('wallet created!!!');
    if(Object.keys(this.props.appStore.localWallets).length > 1){
      this.props.navigation.dispatch(StackActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'MyHome' })]
      }));
    }
    else{
      this.props.navigation.navigate('CompleteWallet', {msg:'Wallet added!'});
    }

  }



  render() {
    console.log(this.state.mnemonic);
    let selectedView = [];
    let selectLine = [];
    let keys =Object.keys(this.state.selected);
    keys.forEach((word, index)=>{
      let view = (<Text key={index} style={{fontSize:18, borderRadius:4, marginRight:4, paddingTop:4, paddingBottom:4, paddingLeft:5, paddingRight:5, color:'rgb(48,109,182)', backgroundColor:'white', borderWidth:1, borderColor:'rgb(227,227,227)'}} onPress={()=>this.deselectWord(word)} >{word}</Text>);
      selectLine.push(view);
      if((index+1) % 4 == 0 || (index == keys.length-1)){
        let line = [];
        Object.assign(line, selectLine);
        selectedView.push(line);
        selectLine = [];
      }
    });


    let candidatedView = [];


    if(this.state.words.length == WORD_SIZE){
      let rows = [];
      this.state.words.forEach((word,index)=>{
        let color = (this.state.selected[word])? 'white':'black';
        let borderColor = (this.state.selected[word])? 'white':'rgb(227,227,227)';
        let view = (<Text key={index} style={{fontSize:18, borderRadius:4, marginRight:8, paddingTop:4, paddingBottom:4, paddingLeft:10, paddingRight:10, color:color, borderWidth:1, borderColor:borderColor}} onPress={()=>this.selectWord(word)} >{word}</Text>);
        rows.push(view);
        if((index+1) % 4 == 0){
          let line = [];
          Object.assign(line, rows);
          candidatedView.push(line);
          rows = [];
        }
      });

    }

    let btnColor = (this.state.verified)? ['#5da7dc', '#306eb6']: ['#dbdbdb','#b5b5b5'];

    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor:'white'}}>
        <Text style={{marginTop:60, fontSize:22, color:'black', fontWeight:'bold'}}>Verify Phrase</Text>
        <Text style={{marginTop:20, marginLeft:26, marginRight:26, fontSize:16, textAlign:'center', color:'rgb(155,155,155)'}}>Select the word in the right order</Text>
        <View style={{width:350,  alignItems:'center', height:160, borderWidth:1, borderColor:'rgb(220,220,220)', borderRadius:5, marginTop:28, backgroundColor:'rgb(243,243,243)'}}>
          {selectedView.map((line,index)=>{
            return (
              <View key={index} style={{flexDirection:'row', marginTop:10}}>
                {line.map((item)=>{
                  return item;
                })}
              </View>
            );
          })}
        </View>
        <View style={{flex:1, alignItems:'center', marginTop:40}}>
          {candidatedView.map((line, index)=>{
            return (
              <View key={index} style={{flexDirection:'row', marginTop:10}}>
                {line.map((item)=>{
                  return item;
                })}
              </View>
            );
          })}
        </View>
        {(!this.state.isProcessing)?(<TouchableOpacity onPress={()=>this.createWallet()}><LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={btnColor} style={{justifyContent: 'center',alignItems: 'center', borderRadius:12, marginBottom:38, backgroundColor:'rgb(48,110,182)',  width:330, height:58}}>
          <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>Next</Text>
        </LinearGradient></TouchableOpacity>):<ActivityIndicator/>}


        <Toast style={{marginBottom:60}} ref="toast"/>
      </View>
    );
  }
}

