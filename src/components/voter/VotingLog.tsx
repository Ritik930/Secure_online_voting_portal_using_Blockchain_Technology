
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import web3Service from "@/utils/web3";

interface Vote {
  voter: string;
  partyIndex: number;
  partyName: string;
}

interface VotingLogProps {
  votes: Vote[];
}

const VotingLog = ({ votes }: VotingLogProps) => {
  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <>
      {votes.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Voter Address</TableHead>
              <TableHead>Party Voted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {votes.map((vote, index) => {
              const isCurrentUser = web3Service.account === vote.voter;
              
              return (
                <TableRow key={index} className={isCurrentUser ? "bg-muted/30" : ""}>
                  <TableCell className="font-mono">
                    {formatAddress(vote.voter)}
                    {isCurrentUser && (
                      <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                    )}
                  </TableCell>
                  <TableCell>{vote.partyName}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center py-4 text-muted-foreground">
          No votes have been cast yet in this election.
        </p>
      )}
    </>
  );
};

export default VotingLog;
