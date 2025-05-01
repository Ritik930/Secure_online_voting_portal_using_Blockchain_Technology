
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import web3Service from "@/utils/web3";

interface Candidate {
  id: number;
  name: string;
  description: string;
  voteCount: number;
}

interface Election {
  id: number;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  creator: string;
  active: boolean;
}

const VotingInterface = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadElectionData = async () => {
      try {
        // In a real app, this would fetch the election from the blockchain
        const elections = await web3Service.getElections();
        const electionId = parseInt(id || '0');
        const foundElection = elections.find(e => e.id === electionId);
        
        if (foundElection) {
          setElection(foundElection);
          const candidateData = await web3Service.getCandidates(electionId);
          setCandidates(candidateData);
          
          // Check if user has already voted
          const account = await web3Service.getAccount();
          if (account) {
            // Mock check for demo - in a real app this would check the blockchain
            setHasVoted(false);
          }
        } else {
          toast({
            variant: "destructive",
            title: "Election Not Found",
            description: "The requested election could not be found."
          });
          navigate('/');
        }
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
  }, [id, navigate, toast]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast({
        variant: "destructive",
        title: "Selection Required",
        description: "Please select a candidate before voting."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await web3Service.vote(
        parseInt(id || '0'),
        selectedCandidate
      );

      if (success) {
        setHasVoted(true);
        // Update the local candidate data with the new vote
        setCandidates(candidates.map(candidate => {
          if (candidate.id === selectedCandidate) {
            return { ...candidate, voteCount: candidate.voteCount + 1 };
          }
          return candidate;
        }));

        toast({
          title: "Vote Submitted",
          description: "Your vote has been recorded on the blockchain.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Vote Failed",
          description: "Your vote could not be recorded. Please try again."
        });
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: "There was an error processing your transaction."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading election data...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Elections
      </Button>

      {election && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{election.title}</CardTitle>
                <CardDescription className="mt-2">{election.description}</CardDescription>
              </div>
              {election.active ? (
                <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
              ) : (
                <Badge variant="outline">Closed</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Start Date:</span> {formatDate(election.startTime)}
              </div>
              <div>
                <span className="font-medium">End Date:</span> {formatDate(election.endTime)}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 flex flex-col gap-8">
            {!hasVoted && election.active ? (
              <RadioGroup 
                value={selectedCandidate?.toString()} 
                onValueChange={(value) => setSelectedCandidate(parseInt(value))}
              >
                <div className="space-y-4">
                  {candidates.map(candidate => (
                    <div 
                      key={candidate.id} 
                      className="flex items-start space-x-2 border p-4 rounded-md hover:bg-accent transition-colors"
                    >
                      <RadioGroupItem value={candidate.id.toString()} id={`candidate-${candidate.id}`} />
                      <div className="flex-1">
                        <Label 
                          htmlFor={`candidate-${candidate.id}`} 
                          className="text-base font-medium cursor-pointer"
                        >
                          {candidate.name}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {candidate.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Results</h3>
                  <div className="text-sm text-muted-foreground">Total Votes: {totalVotes}</div>
                </div>
                
                {candidates.map(candidate => {
                  const percentage = totalVotes > 0 ? Math.round((candidate.voteCount / totalVotes) * 100) : 0;
                  const isWinning = candidate.voteCount === Math.max(...candidates.map(c => c.voteCount));
                  
                  return (
                    <div key={candidate.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{candidate.name}</span>
                          {isWinning && totalVotes > 0 && (
                            <Badge variant="outline" className="text-xs border-green-500 text-green-500">Leading</Badge>
                          )}
                        </div>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{candidate.voteCount} votes</span>
                        {selectedCandidate === candidate.id && hasVoted && (
                          <span className="flex items-center text-green-500">
                            <Check className="h-4 w-4 mr-1" /> Your vote
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>

          {!hasVoted && election.active && (
            <CardFooter>
              <Button 
                onClick={handleVote} 
                disabled={isSubmitting || selectedCandidate === null}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting
                  </>
                ) : (
                  <>Cast Your Vote</>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
};

export default VotingInterface;
