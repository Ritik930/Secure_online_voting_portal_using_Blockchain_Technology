
import { AbiItem } from 'web3-utils';

// Contract ABI - this would be generated from your compiled Solidity contract
// This is a simplified version for demo purposes
export const VotingContractABI: AbiItem[] = [
  // Constructor and admin functions
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isAdmin",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Election management
  {
    "inputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string[]", "name": "partyList", "type": "string[]"}
    ],
    "name": "createElection",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getElections",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "electionId", "type": "uint256"}],
    "name": "getElectionName",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  // Voting functions
  {
    "inputs": [
      {"internalType": "uint256", "name": "electionId", "type": "uint256"},
      {"internalType": "uint256", "name": "partyIndex", "type": "uint256"}
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "electionId", "type": "uint256"},
      {"internalType": "address", "name": "voter", "type": "address"}
    ],
    "name": "hasVoted",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "electionId", "type": "uint256"}],
    "name": "getParties",
    "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "electionId", "type": "uint256"}],
    "name": "getVotes",
    "outputs": [
      {"internalType": "address[]", "name": "", "type": "address[]"},
      {"internalType": "uint256[]", "name": "", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "electionId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "name", "type": "string"}
    ],
    "name": "ElectionCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "electionId", "type": "uint256"},
      {"indexed": false, "internalType": "address", "name": "voter", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "partyIndex", "type": "uint256"}
    ],
    "name": "VoteCast",
    "type": "event"
  }
];

// Mock contract address - in a real app, this would be the deployed contract address
// Use a valid Ethereum address format to prevent errors
export const CONTRACT_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
