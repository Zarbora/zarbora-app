"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { HarbergerPricing } from "./harberger-pricing"

export function ProposeSessionDialog() {
  const [date, setDate] = useState<Date>()
  const [requestPremium, setRequestPremium] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-stone-800 text-white hover:bg-stone-700">Propose Session</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Propose a Session</DialogTitle>
          <DialogDescription>
            Share your knowledge with the community. Anyone can propose a session - no gatekeeping!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Session Title</Label>
            <Input id="title" placeholder="Enter a clear, descriptive title" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What will you cover? What should attendees expect to learn or experience?"
              className="min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time Preference</Label>
              <Select>
                <SelectTrigger id="time" className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12pm - 5pm)</SelectItem>
                  <SelectItem value="evening">Evening (5pm - 9pm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="location">Preferred Location</Label>
              <Select>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main-hall">Main Hall</SelectItem>
                  <SelectItem value="studio-b">Studio B</SelectItem>
                  <SelectItem value="garden-pavilion">Garden Pavilion</SelectItem>
                  <SelectItem value="zen-garden">Zen Garden</SelectItem>
                  <SelectItem value="innovation-lab">Innovation Lab</SelectItem>
                  <SelectItem value="any">Any Available Space</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web3">Web3</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="economics">Economics</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="premium"
              checked={requestPremium}
              onCheckedChange={(checked) => setRequestPremium(!!checked)}
            />
            <Label htmlFor="premium" className="text-sm font-normal">
              Request Premium Slot (Featured visibility, prime room/time)
            </Label>
          </div>

          {requestPremium && <HarbergerPricing />}
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-stone-800 text-white hover:bg-stone-700">
            Submit Proposal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
