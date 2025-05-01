
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import web3Service from "@/utils/web3";

interface VoteFormProps {
  electionId: number;
  parties: string[];
  onVoteSuccess: (partyIndex: number) => void;
}

const VoteForm = ({ electionId, parties, onVoteSuccess }: VoteFormProps) => {
  const [selectedParty, setSelectedParty] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleVote = async () => {
    if (selectedParty === null) {
      toast({
        variant: "destructive",
        title: "Selection Required",
        description: "Please select a party before voting."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await web3Service.vote(electionId, selectedParty);

      if (success) {
        onVoteSuccess(selectedParty);
        
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

  return (
    <div className="space-y-6">
      <RadioGroup 
        value={selectedParty?.toString()} 
        onValueChange={(value) => setSelectedParty(parseInt(value))}
      >
        <div className="space-y-4">
          {parties.map((party, index) => (
            <div 
              key={index} 
              className="flex items-start space-x-2 border p-4 rounded-md hover:bg-accent transition-colors"
            >
              <RadioGroupItem value={index.toString()} id={`party-${index}`} />
              <Label 
                htmlFor={`party-${index}`} 
                className="text-base font-medium cursor-pointer"
              >
                {party}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
      
      <Button 
        onClick={handleVote} 
        disabled={isSubmitting || selectedParty === null}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting Vote
          </>
        ) : (
          <>Cast Your Vote</>
        )}
      </Button>
    </div>
  );
};

export default VoteForm;
