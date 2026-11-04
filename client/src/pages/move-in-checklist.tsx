import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Home, 
  Key, 
  MapPin, 
  Phone,
  AlertCircle,
  Download,
  Star
} from 'lucide-react';
import { format, isAfter, isBefore, isToday, differenceInDays } from 'date-fns';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface ChecklistItem {
  task: string;
  completed: boolean;
  dueDate?: string;
  category?: string;
}

interface MoveInData {
  id: string;
  leadId: string;
  moveInDate: string;
  keyCollectionMethod: string;
  keyCollectionDetails: string;
  keyCollectionTime: string;
  checklistItems: ChecklistItem[];
  welcomePackUrl?: string;
  propertyAddress?: string;
  checklistSent: boolean;
  welcomePackSent: boolean;
  keyDetailsSent: boolean;
  inventorySent: boolean;
}

export default function MoveInChecklist() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get move-in ID from URL query params
  const searchParams = new URLSearchParams(window.location.search);
  const moveInId = searchParams.get('id');

  // Fetch move-in data
  const { data: moveIn, isLoading, error } = useQuery<MoveInData>({
    queryKey: [`/api/move-in/${moveInId}`],
    enabled: !!moveInId,
  });

  // Update checklist item mutation
  const updateChecklistMutation = useMutation({
    mutationFn: async ({ itemIndex, completed }: { itemIndex: number; completed: boolean }) => {
      return apiRequest(`/api/move-in/${moveInId}/checklist/${itemIndex}`, {
        method: 'POST',
        body: JSON.stringify({ completed }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/move-in/${moveInId}`] });
    },
  });

  if (!moveInId) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No move-in ID provided. Please use the link from your email.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="h-64 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (error || !moveIn) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load move-in details. Please try again or contact support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const moveInDate = new Date(moveIn.moveInDate);
  const daysUntilMoveIn = differenceInDays(moveInDate, new Date());
  const isOverdue = daysUntilMoveIn < 0;
  const completedItems = moveIn.checklistItems.filter(item => item.completed).length;
  const progress = (completedItems / moveIn.checklistItems.length) * 100;

  // Categorize checklist items
  const categories = {
    'Before Move-in': moveIn.checklistItems.filter(item => {
      if (!item.dueDate) return false;
      const dueDate = new Date(item.dueDate);
      return isBefore(dueDate, moveInDate);
    }),
    'Move-in Day': moveIn.checklistItems.filter(item => {
      if (!item.dueDate) return true;
      const dueDate = new Date(item.dueDate);
      return isToday(dueDate) || format(dueDate, 'yyyy-MM-dd') === format(moveInDate, 'yyyy-MM-dd');
    }),
    'After Move-in': moveIn.checklistItems.filter(item => {
      if (!item.dueDate) return false;
      const dueDate = new Date(item.dueDate);
      return isAfter(dueDate, moveInDate);
    }),
  };

  const filteredItems = selectedCategory === 'all' 
    ? moveIn.checklistItems 
    : categories[selectedCategory as keyof typeof categories] || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Move-in Checklist</h1>
          <p className="text-muted-foreground">Everything you need for a smooth move-in</p>
        </div>

        {/* Move-in Date Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Move-in Date</p>
                  <p className="text-2xl font-semibold">
                    {format(moveInDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>
              <Badge variant={isOverdue ? "destructive" : daysUntilMoveIn === 0 ? "default" : "secondary"}>
                {isOverdue 
                  ? "Overdue" 
                  : daysUntilMoveIn === 0 
                  ? "Today!" 
                  : `${daysUntilMoveIn} days to go`}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{completedItems} of {moveIn.checklistItems.length} tasks completed</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Key Collection Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Key Collection Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Collection Method</p>
                <p className="font-medium capitalize">{moveIn.keyCollectionMethod}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Collection Time</p>
                <p className="font-medium">{moveIn.keyCollectionTime}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Location/Details</p>
              <p className="font-medium">{moveIn.keyCollectionDetails}</p>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Remember to bring: Photo ID, signed tenancy agreement, and proof of deposit payment
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Your Move-in Tasks</CardTitle>
            <CardDescription>Check off tasks as you complete them</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>
                  All Tasks
                </TabsTrigger>
                <TabsTrigger value="Before Move-in" onClick={() => setSelectedCategory('Before Move-in')}>
                  Before
                </TabsTrigger>
                <TabsTrigger value="Move-in Day" onClick={() => setSelectedCategory('Move-in Day')}>
                  Day Of
                </TabsTrigger>
                <TabsTrigger value="After Move-in" onClick={() => setSelectedCategory('After Move-in')}>
                  After
                </TabsTrigger>
              </TabsList>

              <div className="space-y-3">
                {filteredItems.map((item, index) => {
                  const originalIndex = moveIn.checklistItems.indexOf(item);
                  const dueDate = item.dueDate ? new Date(item.dueDate) : null;
                  const isOverdueItem = dueDate && isBefore(dueDate, new Date()) && !item.completed;

                  return (
                    <div
                      key={originalIndex}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        item.completed ? 'bg-muted/50' : 'bg-background'
                      } ${isOverdueItem ? 'border-destructive' : ''}`}
                    >
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={(checked) => {
                          updateChecklistMutation.mutate({
                            itemIndex: originalIndex,
                            completed: checked as boolean,
                          });
                        }}
                        className="mt-1"
                        data-testid={`checkbox-item-${originalIndex}`}
                      />
                      <div className="flex-1">
                        <p className={`${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.task}
                        </p>
                        {dueDate && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Due: {format(dueDate, 'MMM d, yyyy')}
                            {isOverdueItem && (
                              <Badge variant="destructive" className="ml-2">Overdue</Badge>
                            )}
                          </p>
                        )}
                      </div>
                      {item.completed && (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Welcome Pack */}
        {moveIn.welcomePackSent && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Welcome Pack</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Your welcome pack contains important information about the property, house rules, and local area.
              </p>
              {moveIn.welcomePackUrl ? (
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download Welcome Pack
                </Button>
              ) : (
                <Alert>
                  <AlertDescription>
                    Your welcome pack will be available 1 day before move-in.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Emergency Contacts */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <CardTitle>Important Contacts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Property Office</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri 9am-5pm</p>
                </div>
                <p className="font-mono">0115 123 4567</p>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Emergency Maintenance</p>
                  <p className="text-sm text-muted-foreground">24/7</p>
                </div>
                <p className="font-mono">0800 999 8888</p>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Local Police</p>
                  <p className="text-sm text-muted-foreground">Non-emergency</p>
                </div>
                <p className="font-mono">101</p>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">NHS</p>
                  <p className="text-sm text-muted-foreground">Medical advice</p>
                </div>
                <p className="font-mono">111</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Move-in Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span className="text-sm">Take photos of your room/property condition on move-in day for your records</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span className="text-sm">Check all appliances are working and report any issues immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span className="text-sm">Locate fire exits, extinguishers, and first aid kit on your first day</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span className="text-sm">Introduce yourself to your neighbors - they can be helpful!</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                <span className="text-sm">Set up a direct debit for rent to avoid late payments</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Need help? Contact us at support@termflow.com or call 0115 123 4567</p>
        </div>
      </div>
    </div>
  );
}