import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

interface JoinSocietyDialogProps {
  societyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function JoinSocietyDialog({
  societyId,
  open,
  onOpenChange,
  onSuccess,
}: JoinSocietyDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    applicationText: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);

      // Check for Zupass verification
      const isZupassVerified = await api.members.verifyZupass(formData.address);

      const request = {
        society_id: societyId,
        applicant_address: formData.address,
        applicant_name: formData.name,
        application_text: formData.applicationText,
        zupass_verified: isZupassVerified,
      };

      await api.members.submitMembershipRequest(request);

      toast({
        title: "Success",
        description: isZupassVerified
          ? "Your membership request has been automatically approved via Zupass!"
          : "Your membership request has been submitted for review.",
      });

      setFormData({ name: "", address: "", applicationText: "" });
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit membership request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Society</DialogTitle>
          <DialogDescription>
            Submit a request to join this society. Zupass holders get automatic
            approval.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="address">Wallet Address</label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="application">Application Text</label>
            <Textarea
              id="application"
              value={formData.applicationText}
              onChange={(e) =>
                setFormData({ ...formData, applicationText: e.target.value })
              }
              placeholder="Tell us why you want to join this society..."
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            Submit Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
