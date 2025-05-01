
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import LoadingState from "@/components/ui/loading-state";
import VoteForm from "@/components/voter/VoteForm";
import VotingLog from "@/components/voter/VotingLog";
import VoteConfirmation from "@/components/voter/VoteConfirmation";
import web3Service from "@/utils/web3";

interface Vote {
  voter: string;
  partyIndex: number;
  partyName: string;
}

const VoterInterface = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [election, setElection] = useState<any>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const electionId = parseInt(id || '0');

  useEffect(() => {
    const loadElectionData = async () => {
      try {
        // Connect wallet if not connected
        const account = await web3Service.getAccount();
        if (!account) {
          await web3Service.connectWallet();
        }
        
        // Load election details
        const electionData = await web3Service.getElection(electionId);
        setElection(electionData);
        
        // Check if user has already voted
        const voted = await web3Service.hasVoted(electionId);
        setHasVoted(voted);
        
        // Load voting records
        const votingRecords = await web3Service.getVotingRecords(electionId);
        setVotes(votingRecords);
      } catch (error) {
        console.error("Error loading election data:", error);
        toast({
          variant: "destructive",
          title: "Failed to Load",
          description: "Could not load election data. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };

    loadElectionData();
  }, [electionId, toast]);

  const handleVoteSuccess = async (partyIndex: number) => {
    setHasVoted(true);
    
    // Update the votes list with the new vote
    const account = await web3Service.getAccount();
    if (account && election) {
      const newVote: Vote = {
        voter: account,
        partyIndex: partyIndex,
        partyName: election.parties[partyIndex]
      };
      
      setVotes([...votes, newVote]);
    }
  };

  if (loading) {
    return <LoadingState message="Loading election data..." />;
  }

  if (!election) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p>Election not found</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Back to Elections
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{election.name}</CardTitle>
          <CardDescription>
            Cast your vote for one of the political parties listed below.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!hasVoted ? (
            <VoteForm 
              electionId={electionId} 
              parties={election.parties} 
              onVoteSuccess={handleVoteSuccess} 
            />
          ) : (
            <VoteConfirmation />
          )}
        </CardContent>
      </Card>
      
      {/* Voting Log */}
      <Card>
        <CardHeader>
          <CardTitle>Voting Log</CardTitle>
          <CardDescription>
            View all votes cast in this election
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VotingLog votes={votes} />
        </CardContent>
      </Card>
    </div>
  );
};

export default VoterInterface;
