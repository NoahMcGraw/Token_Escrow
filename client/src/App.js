import React, { Component } from "react";
import Account from "./contracts/Account.json";
import getWeb3 from "./getWeb3";
import Header from "./components/header"
import AccountView from "./components/accountView"

import "./App.css";

class App extends Component {
  state = { balance: 0, web3: null, accounts: null, contract: null, depositAmt: 1 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Account.networks[networkId];
      const instance = new web3.eth.Contract(
        Account.abi,
        deployedNetwork && deployedNetwork.address, {gas: 22000}
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Header />
        <AccountView accounts={this.state.accounts} contract={this.state.contract}/>
      </div>
    );
  }
}

export default App;
