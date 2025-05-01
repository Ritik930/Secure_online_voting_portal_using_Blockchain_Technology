
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import web3Service from "@/utils/web3";

const CreateElection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [candidates, setCandidates] = useState([
    { name: "", description: "" },
    { name: "", description: "" }
  ]);

  const handleAddCandidate = () => {
    setCandidates([...candidates, { name: "", description: "" }]);
  };

  const handleRemoveCandidate = (index: number) => {
    if (candidates.length <= 2) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An election must have at least two candidates."
      });
      return;
    }
    
    const newCandidates = [...candidates];
    newCandidates.splice(index, 1);
    setCandidates(newCandidates);
  };

  const handleCandidateChange = (index: number, key: string, value: string) => {
    const newCandidates = [...candidates];
    newCandidates[index] = { ...newCandidates[index], [key]: value };
    setCandidates(newCandidates);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Please enter an election title." });
      return;
    }
    
    if (!startDate || !endDate) {
      toast({ variant: "destructive", title: "Error", description: "Please select start and end dates." });
      return;
    }
    
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();
    
    if (startTimestamp >= endTimestamp) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "The end date must be after the start date." 
      });
      return;
    }
    
    if (candidates.some(candidate => !candidate.name.trim())) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "All candidates must have a name." 
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit to blockchain
      const candidateNames = candidates.map(c => c.name);
      const candidateDescriptions = candidates.map(c => c.description);
      
      const success = await web3Service.createElection(
        title,
        description,
        startTimestamp,
        endTimestamp,
        candidateNames,
        candidateDescriptions
      );
      
      if (success) {
        toast({
          title: "Election Created",
          description: "Your election has been created successfully."
        });
        navigate('/');
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

  // Minimum date is today
  const today = new Date().toISOString().split('T')[0];

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

      <Card className="shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Election</CardTitle>
            <CardDescription>
              Set up a new blockchain-secured election for transparent and tamper-proof voting.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Election Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Community Board Election 2023"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about this election..."
                className="min-h-24"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={today}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || today}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Candidates</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCandidate}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Candidate
                </Button>
              </div>
              
              {candidates.map((candidate, index) => (
                <div key={index} className="border rounded-md p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Candidate {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCandidate(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`candidate-${index}-name`}>Name</Label>
                    <Input
                      id={`candidate-${index}-name`}
                      value={candidate.name}
                      onChange={(e) => handleCandidateChange(index, "name", e.target.value)}
                      placeholder="Candidate name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`candidate-${index}-description`}>Description</Label>
                    <Input
                      id={`candidate-${index}-description`}
                      value={candidate.description}
                      onChange={(e) => handleCandidateChange(index, "description", e.target.value)}
                      placeholder="Brief description or platform"
                    />
                  </div>
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
    </div>
  );
};

export default CreateElection;
