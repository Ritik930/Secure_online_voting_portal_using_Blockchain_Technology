
import web3Core from './web3Core';
import { Vote } from '../types/web3Types';

class VotingService {
  // Cast a vote
  async vote(electionId: number, partyIndex: number): Promise<boolean> {
    if (!web3Core.contract || !web3Core.account) {
      await web3Core.connectWallet();
      if (!web3Core.account) return false;
    }
    
    try {
      // In a real app with an actual contract:
      // await web3Core.contract.methods.vote(electionId, partyIndex).send({ from: web3Core.account });
      
      console.log(`Voting in election ${electionId} for party index ${partyIndex}`);
      return true; // Mock success
    } catch (error) {
      console.error("Error casting vote:", error);
      return false;
    }
  }

  // Check if user has voted
  async hasVoted(electionId: number): Promise<boolean> {
    if (!web3Core.contract || !web3Core.account) return false;
    
    try {
      // In a real app with an actual contract:
      // return await web3Core.contract.methods.hasVoted(electionId, web3Core.account).call();
      
      // Mock implementation for demo
      return Math.random() < 0.3; // 30% chance user has already voted
    } catch (error) {
      console.error("Error checking vote status:", error);
      return false;
    }
  }

  // Get voting records
  async getVotingRecords(electionId: number): Promise<Vote[]> {
    if (!web3Core.contract) {
      // Mock data for demo
      return [
        { voter: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", partyIndex: 0, partyName: "Democratic Party" },
        { voter: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", partyIndex: 1, partyName: "Republican Party" },
        { voter: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", partyIndex: 0, partyName: "Democratic Party" },
        { voter: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", partyIndex: 2, partyName: "Independent" },
      ];
    }
    
    try {
      // In a real app with an actual contract:
      // const [voters, partyIndices] = await web3Core.contract.methods.getVotes(electionId).call();
      // const parties = await web3Core.contract.methods.getParties(electionId).call();
      // 
      // return voters.map((voter: string, index: number) => ({
      //   voter,
      //   partyIndex: Number(partyIndices[index]),
      //   partyName: parties[partyIndices[index]]
      // }));
      
      // Mock data for demo
      let parties: string[] = [];
      if (electionId === 1) {
        parties = ["Democratic Party", "Republican Party", "Independent"];
      } else if (electionId === 2) {
        parties = ["Progressive Party", "Conservative Party", "Reform Party", "Green Party"];
      }
      
      return [
        { voter: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", partyIndex: 0, partyName: parties[0] },
        { voter: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", partyIndex: 1, partyName: parties[1] },
        { voter: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", partyIndex: 0, partyName: parties[0] },
        { voter: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", partyIndex: parties.length > 2 ? 2 : 0, partyName: parties.length > 2 ? parties[2] : parties[0] },
      ];
    } catch (error) {
      console.error("Error fetching voting records:", error);
      return [];
    }
  }
}

const votingService = new VotingService();
export default votingService;
