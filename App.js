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
import SplashScreen from './src/view/splash_screen';
import GettingStart from './src/view/getting_start';
import BackupWallet from './src/view/backup_wallet';
import CompleteWallet from './src/view/complete_wallet';
import TokenDetail from './src/view/token_detail';
import WithdrawalAddress from './src/view/withdrawal_address'
import WithdrawalToken from './src/view/withdrawal_token';
import VerifySecretWords from './src/view/verify_secret_words';
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


const AddWalletStack = createStackNavigator({
  AddWallet: {
    screen: AddExistWallet,
    navigationOptions: {
      header: null
    }
  },
  FindWalletPrivateKey:{
    screen:FindWalletFromPrivateKey,
    navigationOptions: {
      header: null
    }
  },
  FindWalletWords:{
    screen:FindWalletFromWords,
    navigationOptions: {
      header: null
    }
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
    BackupWallet:{
      screen:BackupWallet
    },
    FindWallet: {
      screen: AddWalletStack,
      navigationOptions: {
        header: null
      }
    },
    Secret: {
      screen: CreatePrivateKeyScreen
    },
    VerifySecret:{
      screen: VerifySecretWords
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
    },
    TokenDetail:{
      screen:TokenDetail,
      navigationOptions: {
        header: null
      }
    },
    Withdrawal:{
      screen:WithdrawalToken,
      navigationOptions: {
        header: null
      }
    },
    WithdrawalAddress:{
      screen:WithdrawalAddress,
      navigationOptions: {
        header: null
      }
    }
  }
);
const RootStack = createSwitchNavigator(
  {
    Splash:{
      screen:SplashScreen
    },
    Home: {
      screen: HomeStack
    },
    Login:{
      screen: LoginStack
    },
    CompleteWallet:{
      screen:CompleteWallet
    }
  },
  {
    initialRouteName: 'Splash',
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

