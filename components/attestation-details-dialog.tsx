"use client";

import { Award, FileCheck, Shield, Star, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

interface AttestationDetailsDialogProps {
  attestation: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AttestationDetailsDialog({
  attestation,
  open,
  onOpenChange,
}: AttestationDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-stone-100 p-2">
              {attestation.type === "skill" && (
                <Star className="h-5 w-5 text-amber-600" />
              )}
              {attestation.type === "contribution" && (
                <FileCheck className="h-5 w-5 text-blue-600" />
              )}
              {attestation.type === "governance" && (
                <Shield className="h-5 w-5 text-purple-600" />
              )}
            </div>
            <DialogTitle className="text-xl">{attestation.name}</DialogTitle>
          </div>
          <DialogDescription>
            Issued by {attestation.issuer} on {formatDate(attestation.date)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
            <h3 className="mb-2 text-sm font-medium">Description</h3>
            <p className="text-sm text-stone-600">{attestation.description}</p>
          </div>

          <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
            <h3 className="mb-2 text-sm font-medium">Attestation Type</h3>
            <Badge
              className={
                attestation.type === "skill"
                  ? "bg-amber-100 text-amber-800"
                  : attestation.type === "contribution"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
              }
            >
              {attestation.type.charAt(0).toUpperCase() +
                attestation.type.slice(1)}
            </Badge>
          </div>

          <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
            <h3 className="mb-2 text-sm font-medium">Issuer Information</h3>
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt={attestation.issuer} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{attestation.issuer}</p>
                <p className="text-xs text-stone-500">
                  Verified Attestation Authority
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
            <h3 className="mb-2 text-sm font-medium">Verification</h3>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-600">
                Cryptographically verified on-chain
              </p>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              This attestation is stored in your Soulbound Token (SBT) and
              cannot be transferred.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
