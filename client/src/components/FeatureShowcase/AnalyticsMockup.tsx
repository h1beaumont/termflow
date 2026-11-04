import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Globe } from "lucide-react";

export function AnalyticsMockup() {
  const bookingPacingData = [
    { month: "Sep", current: 12, previous: 8, benchmark: 15 },
    { month: "Oct", current: 28, previous: 22, benchmark: 30 },
    { month: "Nov", current: 45, previous: 38, benchmark: 48 },
    { month: "Dec", current: 68, previous: 55, benchmark: 70 },
    { month: "Jan", current: 95, previous: 78, benchmark: 95 },
    { month: "Feb", current: 122, previous: 105, benchmark: 120 },
    { month: "Mar", current: 147, previous: 128, benchmark: 145 },
  ];

  const demographics = [
    { name: "Chinese", value: 42, color: "#3b82f6" },
    { name: "Indian", value: 28, color: "#8b5cf6" },
    { name: "UK", value: 15, color: "#10b981" },
    { name: "European", value: 10, color: "#f59e0b" },
    { name: "Other", value: 5, color: "#6b7280" },
  ];

  const revparMetrics = [
    { label: "Current RevPAR", value: "£178", change: "+12%" },
    { label: "Occupancy Rate", value: "94%", change: "+3%" },
    { label: "Avg Weekly Rent", value: "£189", change: "+5%" },
  ];

  return (
    <div className="space-y-6" data-testid="mockup-analytics">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold">Analytics Dashboard</h3>
        <p className="text-sm text-muted-foreground mt-1">Data-driven insights and performance metrics</p>
      </div>

      {/* RevPAR Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {revparMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover-elevate" data-testid={`card-revpar-${index}`}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold">{metric.value}</span>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metric.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Booking Pacing Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Pacing</CardTitle>
            <p className="text-sm text-muted-foreground">Year-over-year comparison vs benchmark</p>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                <div className="h-2 w-2 rounded-full bg-green-600 mr-2" />
                Ahead of pace (147 bookings)
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingPacingData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: 'currentColor' }} />
                <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Line type="monotone" dataKey="current" stroke="hsl(var(--primary))" strokeWidth={3} name="2024 Bookings" />
                <Line type="monotone" dataKey="previous" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" name="2023 Bookings" />
                <Line type="monotone" dataKey="benchmark" stroke="hsl(var(--accent-foreground))" strokeWidth={2} strokeDasharray="3 3" name="Benchmark" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Demographics Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Student Demographics
            </CardTitle>
            <p className="text-sm text-muted-foreground">By nationality (signed contracts)</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={demographics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {demographics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {demographics.map((demo) => (
                <div key={demo.name} className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: demo.color }} />
                  <span>{demo.name}: {demo.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
