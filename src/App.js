import React, { useEffect, useState } from "react";
import ethereumLogo from './assets/ethereum-logo.svg';
import './styles/App.css';
import { ethers } from "ethers";
import murmurationsAlpha from './utils/MurmurationsAlpha.json';

// Constants
const MOBIUS_HANDLE = `m0bius.eth`;
const MOBIUS_ETH = `https://twitter.com/cyclemobius`;
const LINENOISE_HANDLE = `linenoise.eth`;
const LINENOISE_ETH = `https://linenoise.io/`
const CONTRACT_ADDRESS = "0xC625BcBBB91B6Dd4C080DFEB41D848CB6176E4E6";
const TOTAL_MINT_COUNT = 7;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("No ethereum wallet detected.");
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized ethereum account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found.")
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("No ethereum wallet detected.");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected ", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, murmurationsAlpha.abi, signer);
  
        console.log("Opening wallet to pay gas...")
        let nftTransaction = await connectedContract.mintMurmuration();
  
        console.log("Minting...")
        await nftTransaction.wait();
        
        console.log(`Minted, see transaction: https://rinkeby.etherscan.io/tx/${nftTransaction.hash}`);
  
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      <img alt="Ethereum Logo" className="ethereum-logo" src={ethereumLogo} />
      <span className="sign-in-text">Sign in with Ethereum</span>
    </button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <p className="connected-text">
        Connected as {currentAccount}. 
      </p>
      <button onClick={askContractToMintNft} className="cta-button mint-button">
        Mint an NFT
      </button>
    </div>
  );

  // On page load
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">murmurations</p>
          <p className="sub-text">
            Unique bicycles for unique souls. Discover your NFT below.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            renderConnectedContainer()
          )}
        </div>
        <div className="footer-container">
          &mdash;&nbsp;
          <a className="footer-link" href={MOBIUS_ETH} target="_blank" rel="noreferrer">{`${MOBIUS_HANDLE}`}</a>
          &nbsp;&amp;&nbsp;
          <a className="footer-link" href={LINENOISE_ETH} target="_blank" rel="noreferrer">{`${LINENOISE_HANDLE}`}</a>
          &nbsp;&mdash;
        </div>
      </div>
    </div>
  );
};

export default App;
