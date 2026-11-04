import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PoundSterling, Users, Calendar, FileCheck, TrendingUp } from "lucide-react";

export function DashboardMockup() {
  const shouldReduceMotion = useReducedMotion();
  
  const metrics = [
    {
      title: "Revenue Generated",
      value: "£284,500",
      trend: "+18% from last month",
      icon: PoundSterling,
      color: "text-green-600",
    },
    {
      title: "Total Income Secured",
      value: "£342,750",
      trend: "Rent roll + deposits",
      icon: PoundSterling,
      color: "text-emerald-600",
      highlight: true,
    },
    {
      title: "Contracts Signed",
      value: "147",
      trend: "68% conversion rate",
      icon: FileCheck,
      color: "text-blue-600",
    },
    {
      title: "Active Leads",
      value: "216",
      trend: "+12% from last month",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Viewings Booked",
      value: "43",
      trend: "+8% from last month",
      icon: Calendar,
      color: "text-orange-600",
    },
  ];

  const pipeline = [
    { stage: "New Enquiry", count: 28, percentage: 13 },
    { stage: "Viewing Booked", count: 43, percentage: 20 },
    { stage: "Viewed - Awaiting Application", count: 35, percentage: 16 },
    { stage: "Application Submitted", count: 38, percentage: 18 },
    { stage: "Deposit Paid", count: 25, percentage: 12 },
    { stage: "Contract Sent", count: 18, percentage: 8 },
    { stage: "Contract Signed", count: 29, percentage: 13 },
  ];

  return (
    <div className="space-y-6" data-testid="mockup-dashboard">
      {/* Header with Property Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Dashboard Overview</h3>
          <p className="text-sm text-muted-foreground mt-1">Real-time lettings performance</p>
        </div>
        <Select defaultValue="stanley-house" disabled>
          <SelectTrigger className="w-52" data-testid="select-property-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stanley-house">Stanley House</SelectItem>
            <SelectItem value="all">All Properties</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : index * 0.1 }}
          >
            <Card 
              className={`hover-elevate ${metric.highlight ? 'border-green-500/50 bg-green-50/5' : ''}`}
              data-testid={`card-kpi-${metric.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <motion.div
                  animate={shouldReduceMotion ? {} : {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="text-3xl font-bold" 
                  data-testid={`text-kpi-value-${index}`}
                  animate={shouldReduceMotion ? {} : {
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 4,
                    delay: index * 0.2
                  }}
                >
                  {metric.value}
                </motion.div>
                <p className={`text-xs mt-1 flex items-center gap-1 ${metric.color}`}>
                  {metric.trend.includes('%') && <TrendingUp className="h-3 w-3" />}
                  {metric.trend}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pipeline Visualization */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tenant Pipeline</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Lead distribution across stages</p>
            </div>
            <Badge variant="secondary" data-testid="badge-total-leads">216 Total Leads</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipeline.map((stage, index) => (
              <motion.div
                key={stage.stage}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : 0.5 + index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{stage.stage}</span>
                  <span className="text-muted-foreground">
                    {stage.count} ({stage.percentage}%)
                  </span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.percentage}%` }}
                    transition={{ 
                      duration: shouldReduceMotion ? 0 : 0.8, 
                      delay: shouldReduceMotion ? 0 : 0.7 + index * 0.05 
                    }}
                    className="h-full bg-primary"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
