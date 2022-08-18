import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef } from 'react';
import { providers, Contract, utils } from "ethers";
import Web3Modal from "web3modal";
import {
  LW3PUNKS_CONTRACT_ADDRESS,
  abi
} from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [numMintedTokenIds, setNumMintedTokenIds] = useState("");
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  // getProviderOrSigner function
  const getProviderOrSigner = async (needSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);

      if (needSigner) {
        const signer = await web3Provider.getSigner();
        return signer;
      }
      return web3Provider;

    } catch (err) {
      console.error(err);
    }
  }

  // mintLW3PunksToken function
  const mintLW3PunksToken = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      const contractInstance = new Contract(
        LW3PUNKS_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const txn = await contractInstance.mint({
        value: utils.parseEther("0.01")
      });

      setLoading(true);
      await txn.wait();
      setLoading(false);

      getNumTokenIdsMinted();
      window.alert("Congratulations! You successfully minted an LW3Punks NFT!");

    } catch (error) {
      console.error(error);
    }
  }

  // get no of LW3Punks already minted
  const getNumTokenIdsMinted = async () => {
    try {
      const provider = await getProviderOrSigner();

      const contractInstance = new Contract(
        LW3PUNKS_CONTRACT_ADDRESS,
        abi,
        provider
      );

      const numTokensMinted = await contractInstance.tokenIds();
      console.log("numTokenIds: ", numTokensMinted);
      setNumMintedTokenIds(numTokensMinted.toString());
    } catch (error) {
      console.error(error);
    }
  }

  // connectWallet function
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  }

  // useEffect which renders everytime there's a change in 'walletConnect' value
  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getNumTokenIdsMinted();
    }
  }, [walletConnected])

  const renderButton = () => {
    if (!walletConnected) {
      return (
        <button className={styles.button} onClick={connectWallet}>
          Connect Wallet
        </button>
      );
    }

    if (loading) {
      return (
        <div><b>Loading...please Wait!!</b></div>
      )
    }

    return (
      <button className={styles.button} onClick={mintLW3PunksToken}>
        Public Mint 🚀
      </button>
    )
  }
  return (
    <div className={styles.body}>
      <Head>
        <title>LW3Punks</title>
        <meta name="description" content='LW3Punks-Dapp' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to LW3Punks!</h1>
          <div className={styles.description}>
            It is an NFT Collection for LearnWeb3 students!
          </div>
          <div className={styles.description}>
            {numMintedTokenIds}/10 LW3Punks NFT have been minted.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./LW3Punks/1.png" />
        </div>
      </div>
    </div>
  )
}
