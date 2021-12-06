import React, { useEffect, useState } from "react";
import ethereumLogo from './assets/ethereum-logo.svg';
import './styles/App.css';
import { ethers } from "ethers";
import murmurationsAlpha from './utils/MurmurationsAlpha.json';

// Constants
const CONTRACT_CHAIN_ID = `0x4`;
const CONTRACT_CHAIN_NAME = `rinkeby`
const CONTRACT_ADDRESS = `0xA576526CC85e5BBD8382f8dDA7907d918f2bCC2f`;
const CONTRACT_SOURCE = `https://${CONTRACT_CHAIN_NAME}.etherscan.io/address/${CONTRACT_ADDRESS}#code`;
const MOBIUS_HANDLE = `m0bius.eth`;
const MOBIUS_ETH = `https://twitter.com/cyclemobius`;
const MOBIUS_EMAIL = `mailto:mobius@murmurations.gallery`;
const LINENOISE_HANDLE = `linenoise.eth`;
const LINENOISE_ETH = `https://linenoise.io/`;
const LINENOISE_EMAIL = `mailto:linenoise@murmurations.gallery`;
const WEB_SOURCE = `https://github.com/linenoise/murmurations-web`;
const EVM_SOURCE = `https://github.com/linenoise/murmurations-ethereum`;
const OPENSEA_URL = `https://testnets.opensea.io/collection/murmuration-v4`;
const RARIBLE_URL = `https://rinkeby.rarible.com/collection/${CONTRACT_ADDRESS}`;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [chainId, setChainId] = useState("");

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
      setCurrentAccount(account);

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
      setChainId(chainId);

      setupEventListener();
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

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
      setChainId(chainId);

    } catch (error) {
      console.log(error)
    }
  }

  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, murmurationsAlpha.abi, signer);

        connectedContract.on("newMurmurationMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(`We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });
        
        console.log("Event listeners initiatlized.")

      } else {
        console.log("Ethereum object doesn't exist.");
      }
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
        Connected to {CONTRACT_CHAIN_NAME} network ({chainId}) as {currentAccount}.
      </p>
      <button onClick={askContractToMintNft} className="cta-button mint-button">
        Mint a murmuration
      </button>
    </div>
  );

  const renderConnectedToWrongChainContainer = () => (
    <div className="connected-container">
      <p className="connected-text">
        Connected to network {chainId} as {currentAccount}.
        <br /><br />
        This gallery is only offered on the {CONTRACT_CHAIN_NAME} network. Please reconnect your wallet to {CONTRACT_CHAIN_NAME} network (chain ID {CONTRACT_CHAIN_ID}) to mint a murmuration.
      </p>
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
            Unique bicycles for unique souls. Discover your NFT.
            <br /><br />
            View collection on &nbsp;
            <a className="sub-text-link" href={OPENSEA_URL} target="_blank" rel="noreferrer">{`OpenSea`}</a>
            &nbsp;and&nbsp;
            <a className="sub-text-link" href={RARIBLE_URL} target="_blank" rel="noreferrer">{`Rarible`}</a>.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            chainId !== CONTRACT_CHAIN_ID ? (
              renderConnectedToWrongChainContainer()
            ) : (
              renderConnectedContainer()
            )
          )}
        </div>
        <div className="footer-container">
          &mdash;&nbsp;
          <a className="footer-link" href={MOBIUS_ETH} target="_blank" rel="noreferrer">{`${MOBIUS_HANDLE}`}</a>
          &nbsp;(
          <a className="footer-link" href={MOBIUS_EMAIL}>say hello</a>
          )&nbsp;&amp;&nbsp;
          <a className="footer-link" href={LINENOISE_ETH} target="_blank" rel="noreferrer">{`${LINENOISE_HANDLE}`}</a>
          &nbsp;(
          <a className="footer-link" href={LINENOISE_EMAIL}>report a bug</a>
          )&nbsp;&rarr;&nbsp;
          <a className="footer-link" href={CONTRACT_SOURCE} target="_blank" rel="noreferrer">contract</a>
          &nbsp;&amp;&nbsp;
          <a className="footer-link" href={EVM_SOURCE} target="_blank" rel="noreferrer">evm</a>
          &nbsp;&amp;&nbsp;
          <a className="footer-link" href={WEB_SOURCE} target="_blank" rel="noreferrer">web</a>
          &nbsp;&mdash;
        </div>
      </div>
    </div>
  );
};

export default App;
