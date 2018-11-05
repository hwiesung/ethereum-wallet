import React, { Component } from 'react'
import { View,  Button, ActivityIndicator, Text, TouchableHighlight} from 'react-native';
import { observer, inject } from 'mobx-react/native'

import Toast, {DURATION} from 'react-native-easy-toast'

import DefaultPreference from 'react-native-default-preference';


@inject("appStore") @observer
export default class EnterPinNumber extends Component {

  constructor() {
    super();
    this.state = {
      init:false,
      pin : true,
      input:'',
      pinSize:4
    };
  }
  componentDidMount(){
    DefaultPreference.get('my_pin').then((value)=>{
      this.setState({init:true, pin:value});
    });
  }

  componentWillUnmount(){

  }

  clickNumber(number){
    let text = this.state.input;
    if(number<0){
      if(text.length > 0) {
        text = text.substr(0, text.length - 1);
      }
    }
    else{
      text = text+''+number;
    }
    if(this.state.pinSize === text.length){
      if(this.state.pin){
        if(this.state.pin === text){
          this.props.navigation.navigate('Home');
        }
        else{
          this.refs.toast.show('Wrong PIN number', DURATION.LENGTH_SHORT);
          this.setState({input:''});
        }
      }
      else{

        //retry
        DefaultPreference.set('my_pin', text).then(()=>{
          this.setState({init:true, input:'', pin:text});
        });
      }

    }
    else{
      this.setState({input:text});
    }

  }


  render() {
    let msg ='';
    if(this.state.init){
      msg = (this.state.pin)?'Enter your PIN number': 'Please set your pin number';
    }
    let list = [];
    for(let i=0;i<this.state.pinSize;i++){
      list.push(
        (<View key={i} style={{marginLeft:15,marginRight:15, width:10, height:10, borderRadius:90, backgroundColor:(this.state.input.length>i?'rgb(50,113,184)':'rgb(226,226,226)')}} />)
      );
    }


    return (
      <View style={{ flex: 1, backgroundColor:'white' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{marginTop:97, fontSize:22, color:'black', fontWeight:'bold'}}>{msg}</Text>
          <View style={{marginTop:52, flexDirection:'row'}}>
            {
              list.map((item)=>{
                return item;
              })
            }
          </View>
          <View style={{flexDirection:'row', marginTop:40}}>
            <TouchableHighlight onPress={()=>this.clickNumber(1)} underlayColor='rgba(50,113,184,0.1)' style={{borderRadius:90, width:65, height:65, marginLeft:10, alignItems:'center', marginRight:10}}>
              <Text style={{fontSize:38}}>1</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>this.clickNumber(2)} underlayColor='rgba(50,113,184,0.1)' style={{borderRadius:90, width:65, height:65, marginLeft:10, alignItems:'center', marginRight:10}}>
              <Text style={{fontSize:38}}>2</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>this.clickNumber(3)} underlayColor='rgba(50,113,184,0.1)' style={{borderRadius:90, width:65, height:65, marginLeft:10, alignItems:'center', marginRight:10}}>
              <Text style={{fontSize:38}}>3</Text>
            </TouchableHighlight>
          </View>
          <View style={{flexDirection:'row', marginTop:18}}>
            <TouchableHighlight onPress={()=>this.clickNumber(4)} underlayColor='rgba(50,113,184,0.1)' style={{borderRadius:90, width:65, height:65, marginLeft:10, alignItems:'center', marginRight:10}}>
              <Text style={{fontSize:38}}>4</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>this.clickNumber(5)} underlayColor='rgba(50,113,184,0.1)' style={{borderRadius:90, width:65, height:65, marginLeft:10, alignItems:'center', marginRight:10}}>
              <Text style={{fontSize:38}}>5</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>this.clickNumber(6)} underlayColor='rgba(50,113,184,0.1)' style={{borderRadius:90, width:65, height:65, marginLeft:10, alignItems:'center', marginRight:10}}>
              <Text style={{fontSize:38}}>6</Text>
            </TouchableHighlight>
          </View>
          <View style={{flexDirection:'row', marginTop:18}}>
            <TouchableHighlight onPress={()=>this.clickNumber(7)} underlayColor='rgba(50,113,184,0.1)' style={{borderRadius:90, width:65, height:65, marginLeft:10, alignItems:'center', marginRight:10}}>
              <Text style={{fontSize:38}}>7</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>this.clickNumber(8)} underlayColor='rgba(50,113,184,0.1)' style={{borderRadius:90, width:65, height:65, marginLeft:10, alignItems:'center', marginRight:10}}>
              <Text style={{fontSize:38}}>8</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>this.clickNumber(9)} underlayColor='rgba(50,113,184,0.1)' style={{borderRadius:90, width:65, height:65, marginLeft:10, alignItems:'center', marginRight:10}}>
              <Text style={{fontSize:38}}>9</Text>
            </TouchableHighlight>
          </View>
          <View style={{flexDirection:'row', marginTop:18}}>
            <View style={{ width:65, height:65, marginLeft:10, alignItems:'center', marginRight:10}}>

            </View>
            <TouchableHighlight onPress={()=>this.clickNumber(0)} underlayColor='rgba(50,113,184,0.1)' style={{borderRadius:90, width:65, height:65, marginLeft:10, alignItems:'center', marginRight:10}}>
              <Text style={{fontSize:38}}>0</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>this.clickNumber(-1)} underlayColor='rgba(50,113,184,0.1)' style={{borderRadius:90, width:65, height:65, marginLeft:10, alignItems:'center', marginRight:10}}>
              <Text style={{fontSize:38}}>&lt; </Text>
            </TouchableHighlight>
          </View>
        </View>
        <Toast style={{marginBottom:60}} ref="toast"/>
      </View>

    );
  }
}
