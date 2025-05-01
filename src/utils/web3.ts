
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

// Contract ABI - this would be generated from your compiled Solidity contract
// This is a simplified version for demo purposes
const VotingContractABI: AbiItem[] = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_endTime",
        "type": "uint256"
      },
      {
        "internalType": "string[]",
        "name": "candidateNames",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "candidateDescriptions",
        "type": "string[]"
      }
    ],
    "name": "createElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_electionId",
        "type": "uint256"
      }
    ],
    "name": "endElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_electionId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getElections",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_electionId",
        "type": "uint256"
      }
    ],
    "name": "getElectionResults",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "elections",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Mock contract address - in a real app, this would be the deployed contract address
// from a testnet or mainnet network
const CONTRACT_ADDRESS = '0x123...'; // Replace with actual contract address

interface Election {
  id: number;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  creator: string;
  active: boolean;
}

interface Candidate {
  id: number;
  name: string;
  description: string;
  voteCount: number;
}

class Web3Service {
  web3: Web3 | null = null;
  contract: any = null;
  account: string | null = null;

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
      return this.account;
    } catch (error) {
      console.error("Error fetching account:", error);
      return null;
    }
  }

  // Mock implementations for demo - in a real app these would interact with the contract
  async getElections(): Promise<Election[]> {
    // Mock data for demo
    return [
      {
        id: 1,
        title: "Board Member Election",
        description: "Vote for the new board member for 2023",
        startTime: Date.now() - 86400000, // 1 day ago
        endTime: Date.now() + 86400000 * 5, // 5 days from now
        creator: "0xabcd...",
        active: true
      },
      {
        id: 2,
        title: "BJP Community Election",
        description: "Vote on the new community center proposal",
        startTime: Date.now() - 86400000 * 2, // 2 days ago
        endTime: Date.now() + 86400000 * 3, // 3 days from now
        creator: "0xefgh...",
        active: true
      }
    ];
  }

  async getCandidates(electionId: number): Promise<Candidate[]> {
    // Mock data for demo
    if (electionId === 1) {
      return [
        { id: 1, name: "Ritik Kumar", description: "5 years experience on boards", voteCount: 18 },
        { id: 2, name: "Abhisek Bag", description: "Financial expert", voteCount: 18 }
      ];
    } else {
      return [
        { id: 1, name: "Option A: Pragya", description: "exp 5+ in Marking and Finance", voteCount: 30 },
        { id: 2, name: "Option B: Prakhar", description: "exp 6+ in Management", voteCount: 30 }
      ];
    }
  }

  async vote(electionId: number, candidateId: number): Promise<boolean> {
    if (!this.account) {
      await this.connectWallet();
      if (!this.account) return false;
    }
    
    console.log(`Voting for candidate ${candidateId} in election ${electionId}`);
    // In a real app, this would call the smart contract
    // return this.contract.methods.vote(electionId, candidateId).send({ from: this.account });
    
    // Mock implementation for demo
    return true;
  }

  async createElection(
    title: string,
    description: string,
    startTime: number,
    endTime: number,
    candidateNames: string[],
    candidateDescriptions: string[]
  ): Promise<boolean> {
    if (!this.account) {
      await this.connectWallet();
      if (!this.account) return false;
    }

    console.log("Creating election:", { title, description, startTime, endTime, candidateNames, candidateDescriptions });
    // In a real app, this would call the smart contract
    // return this.contract.methods.createElection(
    //   title, description, startTime, endTime, candidateNames, candidateDescriptions
    // ).send({ from: this.account });
    
    // Mock implementation for demo
    return true;
  }
}

// Create a singleton instance
const web3Service = new Web3Service();
export default web3Service;

// Type declaration to make TypeScript happy with ethereum object
declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}
