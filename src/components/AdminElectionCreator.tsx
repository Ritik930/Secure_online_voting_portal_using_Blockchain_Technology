
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import web3Service from "@/utils/web3";

const AdminElectionCreator = () => {
  const { toast } = useToast();
  const [electionName, setElectionName] = useState("");
  const [parties, setParties] = useState<string[]>(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useState(() => {
    const checkAdmin = async () => {
      const account = await web3Service.getAccount();
      if (account) {
        const admin = await web3Service.checkIsAdmin();
        setIsAdmin(admin);
      }
    };
    
    checkAdmin();
  });

  const handleAddParty = () => {
    setParties([...parties, ""]);
  };

  const handleRemoveParty = (index: number) => {
    if (parties.length <= 2) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An election must have at least two parties."
      });
      return;
    }
    
    const newParties = [...parties];
    newParties.splice(index, 1);
    setParties(newParties);
  };

  const handlePartyChange = (index: number, value: string) => {
    const newParties = [...parties];
    newParties[index] = value;
    setParties(newParties);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!electionName.trim()) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Please enter an election name." 
      });
      return;
    }
    
    if (parties.some(party => !party.trim())) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "All parties must have a name." 
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit to blockchain
      const success = await web3Service.createElection(
        electionName,
        parties.filter(p => p.trim())
      );
      
      if (success) {
        toast({
          title: "Election Created",
          description: "Your election has been created successfully."
        });
        // Reset form
        setElectionName("");
        setParties(["", ""]);
      } else {
        toast({
          variant: "destructive",
          title: "Creation Failed",
          description: "Failed to create election. Please try again."
        });
      }
    } catch (error) {
      console.error("Error creating election:", error);
      toast({
        variant: "destructive",
        title: "Transaction Error",
        description: "There was an error processing your transaction."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not admin, don't show the form
  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="shadow-lg mb-8">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Election</CardTitle>
          <CardDescription>
            As an admin, you can create a new election with a list of political parties.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="electionName">Election Name</Label>
            <Input
              id="electionName"
              value={electionName}
              onChange={(e) => setElectionName(e.target.value)}
              placeholder="E.g., Presidential Election 2023"
              required
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Political Parties</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddParty}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Party
              </Button>
            </div>
            
            {parties.map((party, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={party}
                  onChange={(e) => handlePartyChange(index, e.target.value)}
                  placeholder={`Party ${index + 1} name`}
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleRemoveParty(index)}
                  className="p-2"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Election
              </>
            ) : (
              <>Create Election</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AdminElectionCreator;
