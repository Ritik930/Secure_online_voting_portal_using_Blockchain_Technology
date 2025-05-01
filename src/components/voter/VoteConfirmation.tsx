
import { Check } from "lucide-react";

const VoteConfirmation = () => {
  return (
    <div className="flex items-center justify-center p-4 border rounded-md bg-green-50">
      <Check className="h-5 w-5 text-green-500 mr-2" />
      <p>You have already voted in this election. Your vote has been recorded.</p>
    </div>
  );
};

export default VoteConfirmation;
