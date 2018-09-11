import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, Button } from 'react-native';
import firebase from 'react-native-firebase';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';

import WalletScreen from './src/view/wallet_screen';
import TradeScreen from './src/view/trade_screen';
import MyScreen from './src/view/my_screen';

const Tabs = createBottomTabNavigator(
  {
    Home:{
      screen:WalletScreen
    },
    Trade:{
      screen:TradeScreen
    },
    My:{
      screen:MyScreen
    }
  }
);

const HomeStack = createStackNavigator(
  {
    Trade: {
      screen: Tabs,
      navigationOptions: {
        header: null
      }
    }
  }
);
const RootStack = createSwitchNavigator(
  {
    Home: {
      screen: HomeStack


    }
  }
);

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // firebase things?
    };
  }

  componentDidMount() {
    // firebase things?
  }

  login() {
    console.log("hello")

  }

  render() {
    return (
      <RootStack/>
    );
  }
}

