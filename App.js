import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';

import WalletScreen from './src/view/wallet_screen';
import TradeScreen from './src/view/trade_screen';
import MyScreen from './src/view/my_screen';
import CreateWalletScreen from './src/view/create_wallet_screen';
import CreatePrivateKeyScreen from './src/view/create_private_key_screen';
import FindWalletFromPrivateKey from './src/view/find_wallet_from_pk';
import FindWalletFromWords from './src/view/find_wallet_from_words';
import AddExistWallet from './src/view/add_exist_wallet';
import GettingStart from './src/view/getting_start';

import { Provider } from 'mobx-react/native';
import appStore from './src/store/AppStore';

const Tabs = createBottomTabNavigator(
  {
    Wallet:{
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


const AddWalletStack = createSwitchNavigator({
  AddWallet:{
    screen:AddExistWallet
  },
  FindWalletPrivateKey:{
    screen:FindWalletFromPrivateKey
  },
  FindWalletWords:{
    screen:FindWalletFromWords
  }
});


const LoginStack = createStackNavigator(
  {
    Initial: {
      screen: GettingStart,
      navigationOptions: {
        header: null
      }
    },
    CreateWallet:{
      screen:CreateWalletScreen,
    },
    Secret: {
      screen: CreatePrivateKeyScreen
    }

  }
);


const HomeStack = createStackNavigator(
  {
    Main: {
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
    },
    Login:{
      screen: LoginStack
    },
    FindWallet: {
      screen: AddWalletStack
    }
  },
  {
    initialRouteName: 'Login',
  }
);

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <Provider appStore={appStore}><RootStack /></Provider>
    );
  }
}

