
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Vote, Users } from "lucide-react";
import web3Service from "@/utils/web3";

interface Election {
  id: number;
  name: string;
  parties: string[];
  active: boolean;
}

const ElectionsList = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadElections = async () => {
      try {
        const data = await web3Service.getElections();
        setElections(data);
      } catch (error) {
        console.error("Error loading elections:", error);
      } finally {
        setLoading(false);
      }
    };

    loadElections();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (elections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="mb-4 text-muted-foreground">No active elections found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {elections.map((election) => (
        <Card key={election.id} className="voting-card-hover">
          <CardHeader className="pb-2">
            <CardTitle>{election.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {election.parties.length} parties on ballot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="font-medium text-sm">Parties:</p>
              <ul className="list-disc list-inside text-muted-foreground text-sm mt-1">
                {election.parties.map((party, index) => (
                  <li key={index}>{party}</li>
                ))}
              </ul>
            </div>
            <Link to={`/vote/${election.id}`}>
              <Button className="w-full flex items-center justify-center gap-2">
                <Vote className="h-4 w-4" />
                View & Vote
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ElectionsList;
