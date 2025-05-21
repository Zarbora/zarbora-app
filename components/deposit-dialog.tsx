import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAccount } from "wagmi";
import { parseEther, parseUnits } from "viem";
import { useToast } from "@/components/ui/use-toast";

export function DepositDialog() {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("native");
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();
  const { toast } = useToast();

  const handleDeposit = async () => {
    if (!address || !amount) return;

    setIsLoading(true);
    try {
      // TODO: Implement deposit logic based on selectedToken
      const value =
        selectedToken === "native" ? parseEther(amount) : parseUnits(amount, 6); // USDC has 6 decimals

      toast({
        title: "Deposit initiated",
        description: `Depositing ${amount} ${
          selectedToken === "native" ? "ETH" : "USDC"
        }...`,
      });
    } catch (error) {
      console.error("Deposit failed:", error);
      toast({
        title: "Deposit failed",
        description: "There was an error processing your deposit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Deposit Funds</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label>Select Token</Label>
          <RadioGroup
            defaultValue="native"
            value={selectedToken}
            onValueChange={setSelectedToken}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="native" id="native" />
              <Label htmlFor="native">ETH</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="usdc" id="usdc" />
              <Label htmlFor="usdc">USDC</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.000001"
            min="0"
          />
        </div>
      </div>
      <Button
        onClick={handleDeposit}
        disabled={!amount || isLoading || !address}
        className="w-full"
      >
        {isLoading ? "Processing..." : "Deposit"}
      </Button>
    </DialogContent>
  );
}
