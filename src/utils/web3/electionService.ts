
import web3Core from './web3Core';
import { Election } from '../types/web3Types';

class ElectionService {
  // Create new election
  async createElection(name: string, parties: string[]): Promise<boolean> {
    if (!web3Core.contract || !web3Core.account) {
      await web3Core.connectWallet();
      if (!web3Core.account) return false;
    }
    
    try {
      // In a real app with an actual contract:
      // await web3Core.contract.methods.createElection(name, parties).send({ from: web3Core.account });
      
      console.log("Creating election:", { name, parties });
      return true; // Mock success
    } catch (error) {
      console.error("Error creating election:", error);
      return false;
    }
  }

  // Get all elections
  async getElections(): Promise<Election[]> {
    if (!web3Core.contract) {
      // Mock data for demo
      return [
        {
          id: 1,
          name: "Presidential Election 2023",
          parties: ["Democratic Party", "Republican Party", "Independent"],
          active: true
        },
        {
          id: 2,
          name: "City Mayor Election",
          parties: ["Progressive Party", "Conservative Party", "Reform Party", "Green Party"],
          active: true
        }
      ];
    }
    
    try {
      // In a real app with an actual contract:
      // const electionIds = await web3Core.contract.methods.getElections().call();
      // const elections: Election[] = [];
      // 
      // for (const id of electionIds) {
      //   const name = await web3Core.contract.methods.getElectionName(id).call();
      //   const parties = await web3Core.contract.methods.getParties(id).call();
      //   elections.push({ id: Number(id), name, parties, active: true });
      // }
      // 
      // return elections;
      
      // Mock data for demo
      return [
        {
          id: 1,
          name: "Presidential Election 2023",
          parties: ["Democratic Party", "Republican Party", "Independent"],
          active: true
        },
        {
          id: 2,
          name: "City Mayor Election",
          parties: ["Progressive Party", "Conservative Party", "Reform Party", "Green Party"],
          active: true
        }
      ];
    } catch (error) {
      console.error("Error fetching elections:", error);
      return [];
    }
  }

  // Get election details
  async getElection(electionId: number): Promise<Election | null> {
    if (!web3Core.contract) {
      // Mock data for demo based on id
      if (electionId === 1) {
        return {
          id: 1,
          name: "Presidential Election 2023",
          parties: ["Democratic Party", "Republican Party", "Independent"],
          active: true
        };
      } else if (electionId === 2) {
        return {
          id: 2,
          name: "City Mayor Election",
          parties: ["Progressive Party", "Conservative Party", "Reform Party", "Green Party"],
          active: true
        };
      }
      return null;
    }
    
    try {
      // In a real app with an actual contract:
      // const name = await web3Core.contract.methods.getElectionName(electionId).call();
      // const parties = await web3Core.contract.methods.getParties(electionId).call();
      // return { id: Number(electionId), name, parties, active: true };
      
      // Mock data for demo based on id
      if (electionId === 1) {
        return {
          id: 1,
          name: "Presidential Election 2023",
          parties: ["Democratic Party", "Republican Party", "Independent"],
          active: true
        };
      } else if (electionId === 2) {
        return {
          id: 2,
          name: "City Mayor Election",
          parties: ["Progressive Party", "Conservative Party", "Reform Party", "Green Party"],
          active: true
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching election details:", error);
      return null;
    }
  }
}

const electionService = new ElectionService();
export default electionService;
