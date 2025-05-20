"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Users, Vote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Society {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  resourceCount: number;
  governanceWeight: number;
}

export function SocietyOverview() {
  const [societies, setSocieties] = useState<Society[]>([
    {
      id: "1",
      name: "Zarbora Metropolis",
      description: "A decentralized city simulation with Harberger taxes",
      memberCount: 120,
      resourceCount: 79,
      governanceWeight: 500,
    },
  ]);

  const [newSociety, setNewSociety] = useState({
    name: "",
    description: "",
  });

  const handleCreateSociety = () => {
    const society: Society = {
      id: Date.now().toString(),
      name: newSociety.name,
      description: newSociety.description,
      memberCount: 1,
      resourceCount: 0,
      governanceWeight: 100,
    };
    setSocieties([...societies, society]);
    setNewSociety({ name: "", description: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
            Societies
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Create and manage decentralized societies
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-stone-800 text-white hover:bg-stone-700">
              <Building2 className="mr-2 h-4 w-4" />
              Create Society
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Society</DialogTitle>
              <DialogDescription>
                Define the parameters for your new decentralized society.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Society Name</Label>
                <Input
                  id="name"
                  value={newSociety.name}
                  onChange={(e) =>
                    setNewSociety({ ...newSociety, name: e.target.value })
                  }
                  placeholder="Enter society name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSociety.description}
                  onChange={(e) =>
                    setNewSociety({
                      ...newSociety,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your society's purpose and goals"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateSociety}
                className="bg-stone-800 text-white hover:bg-stone-700"
              >
                Create Society
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {societies.map((society) => (
          <Card key={society.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{society.name}</CardTitle>
              <CardDescription>{society.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-stone-600 dark:text-stone-400">
                    <Users className="mr-1 h-4 w-4" />
                    Members
                  </div>
                  <div className="text-lg font-semibold text-stone-900 dark:text-white">
                    {society.memberCount}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-stone-600 dark:text-stone-400">
                    <Building2 className="mr-1 h-4 w-4" />
                    Resources
                  </div>
                  <div className="text-lg font-semibold text-stone-900 dark:text-white">
                    {society.resourceCount}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-stone-600 dark:text-stone-400">
                    <Vote className="mr-1 h-4 w-4" />
                    Governance
                  </div>
                  <div className="text-lg font-semibold text-stone-900 dark:text-white">
                    {society.governanceWeight}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-stone-200 dark:border-stone-700"
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-stone-800 text-white hover:bg-stone-700"
                >
                  Join Society
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
