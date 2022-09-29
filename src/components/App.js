import React, { Component } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
//import { ethers } from "ethers/lib";
import KryptoArt from '../abis/KryptoArt.json';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            //networkIs: ''
            contract: null,
            totalSupply: 0,
            kryptoArtz: []
        }
    }

    /////////////////////////////USING ETHERS.JS INSTEAD OF WEB3/////////////////////////////////////////

    // async componentDidMount() {
    //     await this.loadWeb3ProviderAndBlockchainData();
    // };

    // async loadWeb3ProviderAndBlockchainData() {

    //     // Loads MetaMask as the provider
    //     const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     const signer = provider.getSigner();

    //     // Check if provider loaded
    //     if (provider) {
    //         console.log('eth wallet is connected');
    //     } else {
    //         console.log('no eth wallet detected');
    //     };

    //     // Get accounts and networkId
    //     const accounts = await provider.send('eth_accounts', []);
    //     const networkId = await provider.send('net_version', []);

    //     // Update State with info
    //     this.setState({
    //         account: accounts,
    //         networkIs: networkId
    //     });

    //     // Loads Contract information from the Blockchain
    //     const networkData = KryptoArt.networks[networkId];
    //     //console.log(accounts, networkId, networkData);
    //     if (networkData) {

    //         const contractAbi = KryptoArt.abi;
    //         const contractAddress = networkData.address;

    //         // Ethers use a segregated approach to reading / writing to Contracts
    //         // To read from, use contractRead
    //         // To write to (like to Mint, etc, use contractSign

    //         const contractRead = new ethers.Contract(contractAddress, contractAbi, provider);
    //         const contractSign = new ethers.Contract(contractAddress, contractAbi, signer);

    //         this.setState({
    //             contractRead: contractRead,
    //             contractSign: contractSign
    //         });
    //         console.log(contractRead);
    //     } else {
    //         console.log('Smart Contract is not Deployed')
    //     };
    // }

    // WEB 3 IS DEPRECATED
    //////////////////////////////////////////////////WEB3 WAY//////////////////////////////////////////////

    async componentDidMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    // detect ethereum provider
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
        const web3 = window.web3;
        const accounts = await web3.eth.requestAccounts();
        this.setState({ account: accounts[0] });

        const networkId = await web3.eth.net.getId();
        const networkData = KryptoArt.networks[networkId];

        if (networkData) {
            const abi = KryptoArt.abi;
            const address = networkData.address;
            const contract = new web3.eth.Contract(abi, address);
            this.setState({ contract });

            const totalSupply = await contract.methods.totalSupply().call();
            this.setState({ totalSupply });


            for (let i = 1; i <= totalSupply; i++) {
                const KryptoArt = await contract.methods.kryptoArtz(i - 1).call();

                this.setState({
                    kryptoArtz: [...this.state.kryptoArtz, KryptoArt]
                });
                console.log(this.state.kryptoArtz);
            }
        }
    }

    mint = (kryptoArt) => {
        this.state.contract.methods.mint(kryptoArt).send({ from: this.state.account }).once('receipt', (receipt) => {
            this.setState({
                kryptoArtz: [...this.state.kryptoArtz, KryptoArt]
            });
        });

    }


    render() {
        return (
            <div className="container-filled">
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <div className="navbar-brand col-sm-3 col-md-3 mr-0" style={{ color: "white" }}>
                        Valdrigh NFTs
                    </div>
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                            <small className="text-white">
                                {this.state.account}
                            </small>
                        </li>
                    </ul>
                </nav>

                <div className="container-fluid mt-1">
                    <div className="row">
                        <main role='main' className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto" style={{ opacity: '0.8' }}>
                                <h1 style={{ color: 'black' }}>NFT</h1>
                                <form onSubmit={(event) => {
                                    event.preventDefault();
                                    const kryptoArt = this.kryptoArt.value;
                                    this.mint(kryptoArt);
                                }}>
                                    <input type='text' placeholder='Add a file location' className="form-control mb-1" ref={(input) => this.kryptoArt = input} />

                                    <input style={{ margin: '6px' }} type='submit' className="btn btn-primary btn-black" value='MINT' />

                                </form>
                            </div>
                        </main>
                    </div>
                    <div className="row text-center">
                        {this.state.kryptoArtz.map((kryptoArt, key) => {
                            return (
                                <div>
                                    <div>
                                        <MDBCard className="token img" style={{ maxWidth: '22rem', maxHeight: '45rem' }}>
                                            <MDBCardImage src={kryptoArt} position='top' heigth='250rem' style={{ marginRight: '4px' }} />
                                            <MDBCardBody>
                                                <MDBCardTitle>NFT</MDBCardTitle>
                                                <MDBCardText>
                                                    developed and designed by Valdrigh
                                                </MDBCardText>
                                            </MDBCardBody>
                                        </MDBCard>

                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default App;