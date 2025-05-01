
// Shared types for the web3 utilities

export interface Election {
  id: number;
  name: string;
  parties: string[];
  active: boolean;
}

export interface Vote {
  voter: string;
  partyIndex: number;
  partyName: string;
}

// Type declaration to make TypeScript happy with ethereum object
declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}
