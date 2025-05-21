import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DepositDialog } from "@/components/deposit-dialog";
import { Wallet } from "lucide-react";

interface DepositButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function DepositButton({
  variant = "default",
  size = "default",
  className,
}: DepositButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Wallet className="mr-2 h-4 w-4" />
          Deposit
        </Button>
      </DialogTrigger>
      <DepositDialog />
    </Dialog>
  );
}
