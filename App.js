import React from 'react';
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';

import { Image} from 'react-native';

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
import EnterPinNumber from './src/view/enter_pin_number';
import WithdrawalAddress from './src/view/withdrawal_address'
import WithdrawalToken from './src/view/withdrawal_token';
import TradeHistory from './src/view/trade_history';
import VerifySecretWords from './src/view/verify_secret_words';
import ManageWallet from './src/view/manage_wallet';
import { Provider } from 'mobx-react/native';
import appStore from './src/store/AppStore';



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

const WalletStack = createStackNavigator(
  {
    WalletHome:{
      screen:WalletScreen,
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

const TradeStack = createStackNavigator(
  {
    TradeHome:{
      screen:TradeScreen,
      navigationOptions: {
        header: null
      }
    },
    TradeHistory:{
      screen:TradeHistory,
      navigationOptions: {
        header: null
      }
    }
  }
);

const MyStack = createStackNavigator(
  {
    MyHome:{
      screen:MyScreen,
      navigationOptions: {
        header: null
      }
    },
    ManageWallet:{
      screen:ManageWallet,
      navigationOptions: {
        header: null
      }
    },
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
    FindWalletWords: {
      screen: FindWalletFromWords,
      navigationOptions: {
        header: null
      }
    }
  }
);


const Tabs = createBottomTabNavigator(
  {
    Wallet:{
      screen:WalletStack
    },
    Trade:{
      screen:TradeStack
    },
    Setting:{
      screen:MyStack
    }
  },
  {
    initialRoteName:'Wallet',
    navigationOptions:({navigation})=>{
      return {
        tabBarIcon: ({ focused, tintColor }) => {
          const { routeName } = navigation.state;
          let icon = focused? require('./assets/icoMenuTradeOn.png'): require('./assets/icoMenuTradeOff.png');
          if (routeName === 'Wallet') {
            //icon = require('./assets/icoMenuTradeOff.png');
          } else if (routeName === 'Trade') {
          //  icon = './assets/icoMenuTradeOff.png';
          }
          else{
           // icon = './assets/icoMenuTradeOff.png';
          }

          // You can return any component that you like here! We usually use an
          // icon component from react-native-vector-icons
          return <Image source={icon} />;
        }
      };
    },
    tabBarOptions:{
      activeTintColor:'rgb(48,110,182)',
      inactiveTintColor: "rgb(153,153,153)",
      style: {
        height: 50,
        paddingVertical: 5,
        backgroundColor: "#fff"
      },
      labelStyle:{
        fontSize:10,

      }
    }
  }
);




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
      navigationOptions: {
        header: null
      }
    },
    BackupWallet:{
      screen:BackupWallet,
      navigationOptions: {
        header: null
      }
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


const RootStack = createSwitchNavigator(
  {
    Splash:{
      screen:SplashScreen
    },
    PinNumber:{
      screen:EnterPinNumber
    },
    Home: {
      screen: Tabs
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

