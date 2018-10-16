import React, { Component } from 'react'
import { View,  Button, Text, ActivityIndicator } from 'react-native';

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
      words:[],
      selected:{}
    };
  }

  componentDidMount() {
    let address = this.props.navigation.getParam('address','');
    let privateKey = this.props.navigation.getParam('privateKey','');
    let encrypted = this.props.navigation.getParam('encrypted','');
    let mnemonic = this.props.navigation.getParam('mnemonic','');
    let words = mnemonic.split(' ');
    words = this.shuffle(words);
    this.setState({address:address, privateKey:privateKey, encrypted:encrypted, mnemonic:mnemonic, words:words});
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
    DefaultPreference.set('privateKey', result.data.privateKey).then(()=>{
      console.log('pk saved');
      this.props.appStore.saveWallet(this.state.address, this.state.encrypted, this.state.mnemonic, this.state.privateKey);
    });

  }

  selectWord(word){
    console.log(this.state.selected);
    if(!this.state.selected[word]){
      console.log(word);
      let selected = {};
      Object.assign(selected, this.state.selected)
      selected[word] = true;
      this.setState({selected:selected});
    }
  }

  render() {
    let selectedView = [];
    let selectLine = [];
    Object.keys(this.state.selected).forEach((word, index)=>{
      let view = (<Text key={index} style={{fontSize:18, borderRadius:4, marginRight:8, paddingTop:4, paddingBottom:4, paddingLeft:10, paddingRight:10, color:'rgb(48,109,182)', borderWidth:1, borderColor:borderColor}} onPress={()=>this.selectWord(word)} >{word}</Text>);
      selectLine.push(view);
      if((index+1) % 4 == 0){
        let line = [];
        Object.assign(line, rows);
        candidatedView.push(line);
        selectLine = [];
      }
    });


    let candidatedView = [];


    if(this.state.words.length == 12){
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
        <Text style={{marginTop:98, fontSize:22, color:'black', fontWeight:'bold'}}>Verify Phrase</Text>
        <Text style={{marginTop:20, marginLeft:26, marginRight:26, fontSize:16, textAlign:'center', color:'rgb(155,155,155)'}}>Select the word in the right order</Text>
        <View style={{width:340, height:160, marginTop:28, backgroundColor:'rgb(243,243,243)'}}>
        </View>
        <View style={{flex:1, alignItems:'center', marginTop:64}}>
          {candidatedView.map((line)=>{
            return (
              <View style={{flexDirection:'row', marginTop:10}}>
                {line.map((item)=>{
                  return item;
                })}
              </View>
            );
          })}
        </View>
        {(!this.state.isProcessing)?(<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={btnColor} style={{justifyContent: 'center',alignItems: 'center', borderRadius:12, marginBottom:38, backgroundColor:'rgb(48,110,182)',  width:330, height:58}}>
          <Text style={{color:'white', fontSize:20, fontWeight:'bold'}} onPress={()=>this.createWallet()}>Next</Text>
        </LinearGradient>):null}


        <Toast ref="toast"/>
      </View>
    );
  }
}
