
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Vote } from "lucide-react";
import ConnectWallet from "@/components/ConnectWallet";
import ElectionCard from "@/components/ElectionCard";
import web3Service from "@/utils/web3";

interface Election {
  id: number;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  creator: string;
  active: boolean;
}

const Index = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const data = await web3Service.getElections();
        setElections(data);
      } catch (error) {
        console.error("Error fetching elections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="gradient-bg py-16 px-4 text-white">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-4 flex items-center gap-2">
                <Vote className="h-8 w-8" /> VoteBuddy ETH
              </h1>
              <p className="text-xl max-w-xl">
                A transparent, secure, and decentralized voting platform powered by Ethereum blockchain.
              </p>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Active Elections</h2>
          <Link to="/create">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Election
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : elections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {elections.map((election) => (
              <ElectionCard
                key={election.id}
                id={election.id}
                title={election.title}
                description={election.description}
                startTime={election.startTime}
                endTime={election.endTime}
                participantCount={Math.floor(Math.random() * 100) + 10} // Mock data for demo
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl mb-4">No elections found</h3>
            <p className="text-muted-foreground mb-6">Create your first election to get started!</p>
            <Link to="/create">
              <Button>Create Election</Button>
            </Link>
          </div>
        )}
      </div>

      {/* About section */}
      <div className="bg-muted py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Why Vote on the Blockchain?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold mb-2">Transparency</h3>
              <p className="text-muted-foreground">
                All votes are recorded on the public blockchain, allowing anyone to verify the results.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold mb-2">Security</h3>
              <p className="text-muted-foreground">
                Blockchain technology prevents tampering and ensures votes cannot be altered once cast.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold mb-2">Accessibility</h3>
              <p className="text-muted-foreground">
                Vote from anywhere using your blockchain wallet while maintaining privacy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t py-6 px-4">
        <div className="container mx-auto max-w-4xl text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} VoteBuddy ETH. Powered by Ethereum Blockchain.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
