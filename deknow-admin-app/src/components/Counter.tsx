import {Component} from "react";

import { ethers } from "ethers";
import { Counter as ChainCounter } from "../../../typechain/Counter";
import { DeKnowScholar as ChainDeKnowScholar } from "../../../typechain/DeKnowScholar";
import ChainCounterArtifact from "../artifacts/contracts/Counter.sol/Counter.json"; // Copied from root due to restriction from react
import ChainDeKnowScholarArtifact from "../artifacts/contracts/DeKnow.sol/DeKnowScholar.json"; // Copied from root due to restriction from react
import ConnectWallet from "./shared/ConnectWallet";

// This is the Hardhat Network id, you might change it in the hardhat.config.js
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
// const HARDHAT_NETWORK_ID = '1337'; // to workaround compatibility with metamask
const HARDHAT_NETWORK_ID = '4'; // to workaround compatibility with metamask

// This is an error code that indicates that the user canceled a transaction
// const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const ERC20_ABI = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
  
    // Authenticated Functions
    "function transfer(address to, uint amount) returns (boolean)",
  
    // Events
    "event Transfer(address indexed from, address indexed to, uint amount)"
  ];
const ERC20_TOKEN_ADDRESS = '0x43d2b5cc2e818e4b168f7f34d32f4512674c6868';

const CHAIN_COUNTER_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const CHAIN_DEKNOW_SCHOLAR_ADDRESS = '0x395B09F9229120Cb963E2154ACC8Ef7a82cA6B3c'

declare var window: any;

class NoWalletDetected extends Component {
    render() {
        return (
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="col-6 p-4 text-center">
                        <p>
                            No Ethereum wallet was detected. <br />
                            Please install{" "}
                            <a
                                href="http://metamask.io"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                MetaMask
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

interface CounterProps {}
interface CounterState {
    author: string;
    profileImageUri: string;
    networkError: string;
    selectedAddress: string;
}

class Counter extends Component<CounterProps, CounterState> {
    state: CounterState;
    chainCounter: any;
    chainDeKnowScholar: any;
    _provider: any;

    constructor(props: CounterProps) {
        super(props);
        this.state = {
            author: '',
            profileImageUri: '',
            networkError: '',
            selectedAddress: '',
        };
        this.handleIncrement = this.handleIncrement.bind(this);
        this.handleDecrement = this.handleDecrement.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
    }

    // This method checks if Metamask selected network is Localhost:8545
    _checkNetwork() {
        if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
            return true;
        }

        this.setState({
            networkError: 'Please connect Metamask to Localhost:8545'
        });

        return false;
    }

    async _intializeEthers() {
        // We first initialize ethers by creating a provider using window.ethereum
        this._provider = new ethers.providers.Web3Provider(window.ethereum);

        // When, we initialize the contract using that provider and the token's
        // artifact. You can do this same thing with your contracts.
        this.chainCounter = new ethers.Contract(
            CHAIN_COUNTER_ADDRESS,
            ChainCounterArtifact.abi,
            this._provider.getSigner(0)
        ) as ChainCounter;

        this.chainDeKnowScholar = new ethers.Contract(
            CHAIN_DEKNOW_SCHOLAR_ADDRESS,
            ChainDeKnowScholarArtifact.abi,
            this._provider.getSigner(0)
        ) as ChainDeKnowScholar;
    }

    _initialize(userAddress: string) {
        // This method initializes the dapp

        // We first store the user's address in the component's state
        this.setState({
            selectedAddress: userAddress,
        });

        // Then, we initialize ethers, fetch the token's data, and start polling
        // for the user's balance.

        // Fetching the token data and the user's balance are specific to this
        // sample project, but you can reuse the same initialization pattern.
        this._intializeEthers();
    }

    _dismissNetworkError() {
        this.setState({ networkError: '' });
    }

    async _connectWallet() {
        // This method is run when the user clicks the Connect. It connects the
        // dapp to the user's wallet, and initializes it.

        // To connect to the user's wallet, we have to run this method.
        // It returns a promise that will resolve to the user's address.
        const [selectedAddress] = await window.ethereum.enable();

        // Once we have the address, we can initialize the application.

        // First we check the network
        if (!this._checkNetwork()) {
            return;
        }

        this._initialize(selectedAddress);
    }

    async handleIncrement() {
        const erc20 = new ethers.Contract(ERC20_TOKEN_ADDRESS, ERC20_ABI, this._provider.getSigner(0));
        erc20.balanceOf(CHAIN_COUNTER_ADDRESS).then((balance: number) => {
            console.log(ethers.utils.formatEther(balance.toString()));
          });
        // await this.chainCounter.countUp();
    }

    async handleDecrement() {
        await this.chainCounter.countDown();
    }

    async handleRefresh() {
        const author = await this.chainDeKnowScholar.getAuthor(1);
        console.log(author);
        const profileImageUri = await this.chainDeKnowScholar.getProfileImage(1);
        console.log(profileImageUri);
        this.setState({
            author: author,
            profileImageUri: profileImageUri
        });
    }

    render() {
        // Ethereum wallets inject the window.ethereum object. If it hasn't been
        // injected, we instruct the user to install MetaMask.
        if (window.ethereum === undefined) {
            return <NoWalletDetected />;
        }

        // The next thing we need to do, is to ask the user to connect their wallet.
        // When the wallet gets connected, we are going to save the users's address
        // in the component's state. So, if it hasn't been saved yet, we have
        // to show the ConnectWallet component.
        //
        // Note that we pass it a callback that is going to be called when the user
        // clicks a button. This callback just calls the _connectWallet method.
        if (!this.state.selectedAddress) {
            return (
                <ConnectWallet
                    connectWallet={() => this._connectWallet()}
                    networkError={this.state.networkError}
                    dismiss={() => this._dismissNetworkError()}
                />
            );
        }

      return (
          <div>
              <div>Author: {this.state.author}</div>
              <div>ProfileImage: <img src={this.state.profileImageUri} width="60" height="60" alt="profile"/></div>
              <button onClick={this.handleIncrement}>Increment</button>
              <button onClick={this.handleDecrement}>Decrement</button>
              <button onClick={this.handleRefresh}>Refresh</button>
          </div>
      );
    }
}

export default Counter;