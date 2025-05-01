
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, WalletIcon } from "lucide-react";
import web3Service from "@/utils/web3";
import { useToast } from "@/components/ui/use-toast";

const ConnectWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAccount = async () => {
      const currentAccount = await web3Service.getAccount();
      setAccount(currentAccount);
    };

    checkAccount();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });
    }
  }, []);

  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      const connectedAccount = await web3Service.connectWallet();
      if (connectedAccount) {
        setAccount(connectedAccount);
        toast({
          title: "Wallet Connected",
          description: `Successfully connected to ${formatAddress(connectedAccount)}`
        });
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: "Could not connect to wallet. Is MetaMask installed?"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      {!account ? (
        <Button
          onClick={handleConnect}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <WalletIcon className="h-4 w-4" />
          )}
          Connect Wallet
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-subtle"></div>
          <span className="font-medium text-sm">{formatAddress(account)}</span>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
