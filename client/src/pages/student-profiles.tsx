import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, GraduationCap, TrendingUp, MapPin, Calendar, PoundSterling, Home, Target, Lightbulb } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { SEOHead } from "@/components/SEOHead";

const COLORS = {
  primary: "hsl(220 49% 16%)",
  accent: "hsl(77 70% 50%)",
  blue: "hsl(217 91% 60%)",
  green: "hsl(142 76% 36%)",
  orange: "hsl(25 95% 53%)",
  purple: "hsl(262 83% 58%)",
  red: "hsl(0 84% 60%)",
};

const PIE_COLORS = [COLORS.primary, COLORS.accent, COLORS.blue, COLORS.green, COLORS.orange, COLORS.purple];

export default function StudentProfiles() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');

  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['/api/properties'],
  });

  const { data, isLoading } = useQuery({
    queryKey: ['/api/analytics/student-profiles', selectedPropertyId],
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-12 w-96" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.total === 0) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight" data-testid="text-student-profiles-title">
            Student Profile Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Understand who you're attracting and how to target effectively
          </p>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Student Data Yet</h3>
              <p className="text-muted-foreground">
                Start receiving leads to see demographic insights and targeting recommendations
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { demographics, preferences, targeting, recommendations, total } = data;

  // Transform university data for pie chart
  const universityData = Object.entries(demographics.universities).map(([name, count]) => ({
    name: name === 'Nottingham Trent University' ? 'NTU' : name === 'University of Nottingham' ? 'UoN' : name,
    value: count as number,
    fullName: name,
  }));

  // Transform year of study for bar chart
  const yearOfStudyData = Object.entries(demographics.yearOfStudy)
    .filter(([, count]) => count > 0)
    .map(([year, count]) => ({
      year,
      count,
    }));

  // Transform UK vs International for pie chart
  const ukVsIntData = Object.entries(demographics.ukVsInternational)
    .filter(([, count]) => count > 0)
    .map(([name, count]) => ({
      name,
      value: count as number,
    }));

  // Transform move-in dates for bar chart
  const moveInData = Object.entries(preferences.moveInDates)
    .filter(([, count]) => count > 0)
    .map(([date, count]) => ({
      date,
      count,
    }));

  // Transform budget ranges for bar chart
  const budgetData = Object.entries(preferences.budgetRanges)
    .filter(([, count]) => count > 0)
    .map(([range, count]) => ({
      range,
      count,
    }));

  // Transform room types for bar chart
  const roomTypeData = Object.entries(preferences.roomTypes)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => ({
      type,
      count,
    }));

  // Transform lead sources for bar chart
  const sourceData = Object.entries(targeting.sources).map(([source, count]) => ({
    source: source.replace('_', ' '),
    count,
  }));

  // Transform property preferences for bar chart
  const propertyData = Object.entries(targeting.propertyPreferences).map(([property, count]) => ({
    property,
    count,
  }));

  return (
    <div className="p-8 space-y-8">
      <SEOHead
        title="Student Profiles - TermFlow | Demographic Analytics"
        description="Understand your student tenant demographics and preferences. Analyze universities, courses, budgets and optimize targeting for Sept 2026 intake."
      />
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight" data-testid="text-student-profiles-title">
          Student Profile Analytics
        </h1>
        <p className="text-muted-foreground mt-2">
          Understand who you're attracting and how to target effectively
        </p>
        <div className="mt-4">
          <Badge variant="secondary" className="text-base px-4 py-2" data-testid="badge-total-students">
            {total} Total Students Analyzed
          </Badge>
        </div>
      </div>

      {/* Property Filter */}
      {!propertiesLoading && properties && properties.length > 1 && (
        <div className="flex items-center gap-3">
          <Label>Filter by Property:</Label>
          <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
            <SelectTrigger className="w-64" data-testid="select-property-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map((p: any) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    

      {/* Actionable Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-bold">Actionable Insights</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((rec: any, idx: number) => (
              <Card key={idx} className="border-l-4 border-l-accent hover-elevate" data-testid={`card-recommendation-${idx}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-accent mt-0.5" />
                    <p className="text-sm font-medium" data-testid={`text-recommendation-${idx}`}>{rec.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Demographics Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Demographics</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* University Breakdown */}
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                University Breakdown
              </CardTitle>
              <CardDescription>Student distribution by institution</CardDescription>
            </CardHeader>
            <CardContent>
              {universityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={universityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill={COLORS.primary}
                      dataKey="value"
                    >
                      {universityData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `${value} students`}
                      labelFormatter={(label) => universityData.find(d => d.name === label)?.fullName || label}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">No university data</p>
              )}
            </CardContent>
          </Card>

          {/* Year of Study */}
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Year of Study
              </CardTitle>
              <CardDescription>Distribution across academic years</CardDescription>
            </CardHeader>
            <CardContent>
              {yearOfStudyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={yearOfStudyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">No year data</p>
              )}
            </CardContent>
          </Card>

          {/* UK vs International */}
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                UK vs International
              </CardTitle>
              <CardDescription>Student origin breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {ukVsIntData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={ukVsIntData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill={COLORS.primary}
                      dataKey="value"
                    >
                      {ukVsIntData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value} students`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">No origin data</p>
              )}
            </CardContent>
          </Card>

          {/* Top Courses */}
          <Card className="hover-elevate md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Top Courses</CardTitle>
              <CardDescription>Most common fields of study</CardDescription>
            </CardHeader>
            <CardContent>
              {demographics.topCourses && demographics.topCourses.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {demographics.topCourses.map((course: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between gap-4" data-testid={`course-${idx}`}>
                      <span className="text-sm font-medium">{course.course}</span>
                      <Badge variant="secondary" data-testid={`badge-course-count-${idx}`}>{course.count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No course data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preferences & Trends */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Preferences & Trends</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Move-in Dates */}
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Move-in Dates
              </CardTitle>
              <CardDescription>Preferred move-in timeline</CardDescription>
            </CardHeader>
            <CardContent>
              {moveInData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={moveInData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.green} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">No move-in date data</p>
              )}
            </CardContent>
          </Card>

          {/* Budget Ranges */}
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PoundSterling className="h-4 w-4" />
                Budget Ranges
              </CardTitle>
              <CardDescription>Weekly rent expectations</CardDescription>
            </CardHeader>
            <CardContent>
              {budgetData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.orange} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">No budget data</p>
              )}
            </CardContent>
          </Card>

          {/* Room Type Demand */}
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Room Type Demand
              </CardTitle>
              <CardDescription>Preferred accommodation types</CardDescription>
            </CardHeader>
            <CardContent>
              {roomTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={roomTypeData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">No room type data</p>
              )}
            </CardContent>
          </Card>

          {/* Lifestyle Preferences */}
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle>Lifestyle Preferences</CardTitle>
              <CardDescription>Group vs solo bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(preferences.lifestyle).map(([type, count]: [string, any]) => {
                  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{type}</span>
                        <span className="text-sm text-muted-foreground">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Targeting Insights */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Targeting Insights</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Lead Sources */}
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
              <CardDescription>Where your students are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              {sourceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={sourceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="source" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.accent} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">No source data</p>
              )}
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Pipeline progression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {targeting.conversionFunnel.map((stage: any, idx: number) => {
                  const percentage = total > 0 ? Math.round((stage.count / total) * 100) : 0;
                  const prevStage = idx > 0 ? targeting.conversionFunnel[idx - 1] : null;
                  const conversionRate = prevStage && prevStage.count > 0
                    ? Math.round((stage.count / prevStage.count) * 100)
                    : 100;

                  return (
                    <div key={stage.stage} className="space-y-2" data-testid={`funnel-stage-${idx}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{stage.stage}</span>
                        <span className="text-sm text-muted-foreground">
                          {stage.count} ({percentage}%)
                          {idx > 0 && (
                            <span className="ml-2 text-xs">
                              {conversionRate}% conversion
                            </span>
                          )}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Property Preferences */}
          {propertyData.length > 0 && (
            <Card className="hover-elevate md:col-span-2">
              <CardHeader>
                <CardTitle>Property Preferences</CardTitle>
                <CardDescription>Which properties attract the most interest</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={propertyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="property" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
