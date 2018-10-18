import React, { Component } from 'react'
import { View,  Button, ActivityIndicator, Text} from 'react-native';
import { observer, inject } from 'mobx-react/native'
import { firebaseApp } from '../firebase'
import Toast, {DURATION} from 'react-native-easy-toast'
import LinearGradient from 'react-native-linear-gradient';

@inject("appStore") @observer
export default class SplashScreen extends Component {

  constructor() {
    super();

  }
  componentWillMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user ) {
        console.log('userStateChanged:'+user.uid);
        const currentUser = firebaseApp.auth().currentUser;
        console.log(currentUser);
        this.props.appStore.init(currentUser.uid);


      }
      else{
        console.log('not user');
        firebaseApp.auth().signInAnonymouslyAndRetrieveData().catch((err)=>{
          if(err){
            this.refs.toast.show('Failed to Login, Please turn on mobile network.', DURATION.LENGTH_SHORT);
          }
        });
      }

    });
  }

  componentWillUnmount(){
    console.log('singinPage will unmount');
  }


  render() {
    console.log(this.state);
    if(this.props.appStore.user){
      if(this.props.appStore.user.init){
        this.props.navigation.navigate('Home');
      }
      else{
        this.props.navigation.navigate('GettingStart');
      }

    }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'white' }}>
        <Text>Splash</Text>
      </View>

    );
  }
}
