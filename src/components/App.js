import React, { Component } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
//import KryptoBird from '../abis/KryptoBird.json';

class App extends Component {

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    //detect ethereum provider
    async loadWeb3() {
        const provider = await detectEthereumProvider();

        //modern browsers
        if (provider) {
            console.log('eth wallet is connected');
            window.web3 = new Web3(provider)
        } else {
            console.log('no eth wallet detected')
        }
    }

    async loadBlockchainData() {
        const accounts = await window.web3.eth.requestAccounts();
        console.log(accounts);
    }

    render() {
        return (
            <div>
                <h1>NFT Marketplace</h1>
            </div>
        )
    }
}

export default App;