
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface ElectionCardProps {
  id: number;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  participantCount?: number;
}

const ElectionCard: React.FC<ElectionCardProps> = ({
  id,
  title,
  description,
  startTime,
  endTime,
  participantCount = 0,
}) => {
  const isActive = startTime <= Date.now() && endTime >= Date.now();
  const isUpcoming = startTime > Date.now();
  const isEnded = endTime < Date.now();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = () => {
    if (isActive) {
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
    } else if (isUpcoming) {
      return <Badge className="bg-blue-500 hover:bg-blue-600">Upcoming</Badge>;
    } else if (isEnded) {
      return <Badge variant="outline">Ended</Badge>;
    }
  };

  const getTimeRemaining = () => {
    if (isUpcoming) {
      const days = Math.floor((startTime - Date.now()) / (1000 * 60 * 60 * 24));
      return `Starts in ${days} day${days !== 1 ? 's' : ''}`;
    } else if (isActive) {
      const days = Math.floor((endTime - Date.now()) / (1000 * 60 * 60 * 24));
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    } else {
      return 'Ended';
    }
  };

  return (
    <Card className="voting-card-hover">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{title}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatDate(startTime)} - {formatDate(endTime)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm font-medium">{getTimeRemaining()}</span>
        <Link to={`/vote/${id}`}>
          <Button disabled={isEnded}>
            {isActive ? 'Vote Now' : isUpcoming ? 'View Details' : 'See Results'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ElectionCard;
