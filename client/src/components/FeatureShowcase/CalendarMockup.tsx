import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Bell, ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarMockup() {
  const shouldReduceMotion = useReducedMotion();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const calendarDays = [
    { date: 1, bookings: [] },
    { date: 2, bookings: [] },
    { date: 3, bookings: [] },
    { date: 4, bookings: [] },
    { date: 5, bookings: [{ time: "2:00 PM", name: "Wei Li", type: "viewing" }] },
    { date: 6, bookings: [] },
    { date: 7, bookings: [] },
    { date: 8, bookings: [{ time: "11:00 AM", name: "Sarah Chen", type: "viewing" }] },
    { date: 9, bookings: [] },
    { date: 10, bookings: [{ time: "3:30 PM", name: "Emma Wilson", type: "viewing" }] },
    { date: 11, bookings: [] },
    { date: 12, bookings: [{ time: "10:00 AM", name: "James Park", type: "viewing" }, { time: "2:00 PM", name: "Lisa Wang", type: "viewing" }] },
    { date: 13, bookings: [] },
    { date: 14, bookings: [] },
    { date: 15, bookings: [{ time: "1:00 PM", name: "Contract Signing", type: "admin" }] },
    { date: 16, bookings: [] },
    { date: 17, bookings: [] },
    { date: 18, bookings: [{ time: "9:30 AM", name: "Alex Kumar", type: "viewing" }] },
    { date: 19, bookings: [] },
    { date: 20, bookings: [] },
    { date: 21, bookings: [] },
    { date: 22, bookings: [{ time: "2:30 PM", name: "Sophie Taylor", type: "viewing" }] },
    { date: 23, bookings: [] },
    { date: 24, bookings: [] },
    { date: 25, bookings: [] },
    { date: 26, bookings: [{ time: "11:30 AM", name: "Maintenance Check", type: "admin" }] },
    { date: 27, bookings: [] },
    { date: 28, bookings: [] },
  ];

  const upcomingReminders = [
    { time: "10:00 AM", date: "Today", title: "Viewing with Wei Li", type: "whatsapp", status: "sent" },
    { time: "2:00 PM", date: "Tomorrow", title: "Follow-up: Sarah Chen", type: "email", status: "scheduled" },
    { time: "11:00 AM", date: "Jan 18", title: "Viewing reminder: Emma Wilson", type: "sms", status: "scheduled" },
  ];

  const staffAvailability = [
    { name: "John Smith", role: "Property Manager", available: true, slots: 4 },
    { name: "Lisa Brown", role: "Viewing Agent", available: true, slots: 6 },
    { name: "Mike Davis", role: "Maintenance", available: false, slots: 0 },
  ];

  return (
    <div className="space-y-6" data-testid="mockup-calendar">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Smart Calendar</h3>
          <p className="text-sm text-muted-foreground mt-1">Automated scheduling and reminders</p>
        </div>
        <Button variant="outline" size="sm" data-testid="button-sync-calendar">
          <Calendar className="h-4 w-4 mr-2" />
          Sync with Google Calendar
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                January 2024
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" data-testid="button-prev-month">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" data-testid="button-next-month">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => (
                <motion.div
                  key={index}
                  initial={shouldReduceMotion ? {} : { scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2, delay: shouldReduceMotion ? 0 : index * 0.01 }}
                  className={`aspect-square rounded-lg border-2 p-1 hover-elevate cursor-pointer transition-all ${
                    day.bookings.length > 0
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/30"
                  } ${day.date === 12 ? "ring-2 ring-primary ring-offset-2" : ""}`}
                  data-testid={`calendar-day-${day.date}`}
                >
                  <div className="text-xs font-semibold mb-0.5">{day.date}</div>
                  {day.bookings.length > 0 && (
                    <div className="space-y-0.5">
                      {day.bookings.slice(0, 2).map((booking, i) => (
                        <div
                          key={i}
                          className={`text-[10px] px-1 py-0.5 rounded ${
                            booking.type === "viewing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {booking.time}
                        </div>
                      ))}
                      {day.bookings.length > 2 && (
                        <div className="text-[9px] text-muted-foreground">
                          +{day.bookings.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-blue-100 border border-blue-300" />
                <span>Viewings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-purple-100 border border-purple-300" />
                <span>Admin Tasks</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar with Reminders and Staff */}
        <div className="space-y-6">
          {/* Upcoming Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4" />
                Auto Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingReminders.map((reminder, index) => (
                  <motion.div
                    key={index}
                    initial={shouldReduceMotion ? {} : { x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.3, delay: shouldReduceMotion ? 0 : index * 0.1 }}
                    className="p-3 rounded-lg bg-muted/50 border"
                    data-testid={`reminder-${index}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-medium">{reminder.title}</p>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          reminder.status === "sent"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        {reminder.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{reminder.time} · {reminder.date}</span>
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {reminder.type.toUpperCase()}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Staff Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Staff Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {staffAvailability.map((staff, index) => (
                  <motion.div
                    key={staff.name}
                    initial={shouldReduceMotion ? {} : { x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.3, delay: shouldReduceMotion ? 0 : 0.3 + index * 0.1 }}
                    className="flex items-center justify-between"
                    data-testid={`staff-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          staff.available ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium">{staff.name}</p>
                        <p className="text-xs text-muted-foreground">{staff.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {staff.slots} slots
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">8 Viewings</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reminders Sent</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">No-Show Rate</p>
                <p className="text-2xl font-bold">4%</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
