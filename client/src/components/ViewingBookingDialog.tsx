import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Video, MapPin, Loader2 } from "lucide-react";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface ViewingBookingDialogProps {
  room: {
    id: string;
    roomNumber: string;
    roomType: string;
  };
  property: {
    id: string;
    name: string;
  };
  leadId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ViewingBookingDialog({
  room,
  property,
  leadId,
  open,
  onOpenChange,
  onSuccess,
}: ViewingBookingDialogProps) {
  const { toast } = useToast();
  const [viewingType, setViewingType] = useState<string>("in_person");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("10:00");

  const bookViewingMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDate) {
        throw new Error("Please select a date");
      }

      // Combine date and time
      const [hours, minutes] = selectedTime.split(':');
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // If no leadId, create a lead first (for unauthenticated users)
      let actualLeadId = leadId;
      if (!actualLeadId) {
        const leadResponse = await apiRequest("POST", "/api/leads", {
          propertyId: property.id,
          roomId: room.id,
          source: "web",
          stage: "new_enquiry",
        });
        const leadData = await leadResponse.json();
        actualLeadId = leadData.lead?.id || leadData.id;
      }

      await apiRequest("POST", "/api/viewings", {
        leadId: actualLeadId,
        propertyId: property.id,
        viewingType,
        scheduledAt: scheduledAt.toISOString(),
        duration: 30,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/viewings/upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({
        title: "Viewing Booked!",
        description: `Your ${viewingType === 'in_person' ? 'in-person' : 'video'} viewing has been booked.`,
      });
      onOpenChange(false);
      onSuccess?.();
      setSelectedDate(undefined);
      setSelectedTime("10:00");
      setViewingType("in_person");
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book viewing",
        variant: "destructive",
      });
    },
  });

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-viewing-booking">
        <DialogHeader>
          <DialogTitle>Book a Viewing</DialogTitle>
          <DialogDescription>
            Book a viewing for Room {room.roomNumber} ({room.roomType}) at {property.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Viewing Type */}
          <div className="space-y-3">
            <Label>Viewing Type</Label>
            <RadioGroup value={viewingType} onValueChange={setViewingType}>
              <div className="flex items-start gap-3 p-4 border rounded-md hover-elevate active-elevate-2">
                <RadioGroupItem value="in_person" id="in_person" data-testid="radio-in-person" />
                <div className="flex-1">
                  <label htmlFor="in_person" className="flex items-center gap-2 font-medium cursor-pointer">
                    <MapPin className="h-4 w-4" />
                    In-Person Viewing
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Visit the property in person
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border rounded-md hover-elevate active-elevate-2">
                <RadioGroupItem value="video_call" id="video_call" data-testid="radio-video-call" />
                <div className="flex-1">
                  <label htmlFor="video_call" className="flex items-center gap-2 font-medium cursor-pointer">
                    <Video className="h-4 w-4" />
                    Video Call Viewing
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Join via Google Meet
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Date Selection */}
          <div className="space-y-3">
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  data-testid="button-select-date"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-3">
            <Label>Select Time</Label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  data-testid={`button-time-${time}`}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-booking"
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => bookViewingMutation.mutate()}
            disabled={!selectedDate || bookViewingMutation.isPending}
            data-testid="button-confirm-booking"
          >
            {bookViewingMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
