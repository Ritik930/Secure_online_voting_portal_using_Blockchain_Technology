
import Web3 from 'web3';
import { VotingContractABI, CONTRACT_ADDRESS } from './contractABI';

class Web3Core {
  web3: Web3 | null = null;
  contract: any = null;
  account: string | null = null;
  isAdmin: boolean = false;

  constructor() {
    this.initWeb3();
  }

  async initWeb3() {
    if (window.ethereum) {
      try {
        // Request account access
        this.web3 = new Web3(window.ethereum);
        console.log("Using Web3 with ethereum provider");
      } catch (error) {
        console.error("User denied account access");
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
      console.log("Using legacy Web3");
    }
    // Non-dapp browsers...
    else {
      console.log("Non-Ethereum browser detected. Consider trying MetaMask!");
    }

    if (this.web3) {
      this.contract = new this.web3.eth.Contract(
        VotingContractABI,
        CONTRACT_ADDRESS
      );
    }
  }

  async connectWallet(): Promise<string | null> {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed. Please install MetaMask to use this application.");
    }
    
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      this.account = accounts[0];
      
      // Check if user is admin
      if (this.contract && this.account) {
        this.isAdmin = await this.checkIsAdmin();
      }
      
      return this.account;
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      return null;
    }
  }

  async getAccount(): Promise<string | null> {
    if (!this.web3) return null;
    
    try {
      const accounts = await this.web3.eth.getAccounts();
      this.account = accounts[0] || null;
      
      // Check if user is admin
      if (this.contract && this.account) {
        this.isAdmin = await this.checkIsAdmin();
      }
      
      return this.account;
    } catch (error) {
      console.error("Error fetching account:", error);
      return null;
    }
  }

  async checkIsAdmin(): Promise<boolean> {
    if (!this.contract || !this.account) return false;
    
    try {
      return await this.contract.methods.isAdmin().call({ from: this.account });
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }
}

// Create a singleton instance
const web3Core = new Web3Core();
export default web3Core;
