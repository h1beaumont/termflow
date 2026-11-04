import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Search, Filter, X, Clock, TrendingUp, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { ServiceSchema } from "@/components/ServiceSchema";
import { SiteSearch } from "@/components/SiteSearch";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { automationIdeas, categoryLabels, complexityLabels, roiImpactLabels, type AutomationIdea } from "@/data/automationIdeas";

export default function AutomationIdeasLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedComplexity, setSelectedComplexity] = useState<string>("all");
  const [selectedROI, setSelectedROI] = useState<string>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter automation ideas
  const filteredIdeas = useMemo(() => {
    return automationIdeas.filter((idea) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === "all" || idea.category === selectedCategory;

      // Complexity filter
      const matchesComplexity = selectedComplexity === "all" || idea.complexity === selectedComplexity;

      // ROI filter
      const matchesROI = selectedROI === "all" || idea.roiImpact === selectedROI;

      return matchesSearch && matchesCategory && matchesComplexity && matchesROI;
    });
  }, [searchQuery, selectedCategory, selectedComplexity, selectedROI]);

  // Check if any filters are active
  const hasActiveFilters = selectedCategory !== "all" || selectedComplexity !== "all" || selectedROI !== "all" || searchQuery !== "";

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedComplexity("all");
    setSelectedROI("all");
  };

  // Get complexity badge variant
  const getComplexityColor = (complexity: AutomationIdea['complexity']) => {
    switch (complexity) {
      case 'low': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'medium': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'high': return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }
  };

  // Get ROI badge variant
  const getROIColor = (roi: AutomationIdea['roiImpact']) => {
    switch (roi) {
      case 'low': return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      case 'medium': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'high': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="PBSA Automation Ideas Library | 30+ Practical Automation Ideas"
        description="Browse 30+ practical automation ideas for student accommodation providers. Filter by category, complexity, and ROI impact to find the perfect automation for your PBSA operation."
        keywords={['automation ideas', 'PBSA automation', 'lettings automation', 'workflow automation', 'student accommodation automation', 'property management automation']}
        ogType="website"
      />

      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://termflow.co.uk' },
          { name: 'Resources', url: 'https://termflow.co.uk/resources' },
          { name: 'Automation Ideas Library', url: 'https://termflow.co.uk/automation-ideas' }
        ]}
      />

      <ServiceSchema
        serviceName="PBSA Automation Ideas Library"
        description="Comprehensive library of practical automation ideas for student accommodation providers with filters by category, complexity, and ROI impact"
        url="https://termflow.co.uk/automation-ideas"
      />

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2" data-testid="link-home">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">TF</span>
              </div>
              <span className="font-semibold text-lg hidden sm:inline">TermFlow</span>
            </Link>
            <div className="flex-1 max-w-md">
              <SiteSearch />
            </div>
            <Button asChild variant="default" size="sm" data-testid="button-book-demo">
              <Link href="/book-demo">Book Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-transparent py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">30+ Practical Automation Ideas</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              PBSA Automation Ideas Library
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover practical automation ideas to reduce admin, improve tenant experience, and scale your PBSA operation. 
              Filter by category, complexity, and ROI impact to find the perfect automation for your team.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>{automationIdeas.length} automation ideas</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>9 categories</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Time & cost estimates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full" data-testid="button-toggle-filters">
                  <Filter className="w-4 h-4 mr-2" />
                  {filtersOpen ? 'Hide Filters' : 'Show Filters'}
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {[selectedCategory !== "all", selectedComplexity !== "all", selectedROI !== "all", searchQuery !== ""].filter(Boolean).length}
                    </Badge>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="space-y-4">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search automation ideas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-search"
                    />
                  </div>

                  {/* Mobile Filters */}
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                    <SelectTrigger data-testid="select-complexity">
                      <SelectValue placeholder="All Complexity Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Complexity Levels</SelectItem>
                      <SelectItem value="low">Low Complexity</SelectItem>
                      <SelectItem value="medium">Medium Complexity</SelectItem>
                      <SelectItem value="high">High Complexity</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedROI} onValueChange={setSelectedROI}>
                    <SelectTrigger data-testid="select-roi">
                      <SelectValue placeholder="All ROI Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All ROI Levels</SelectItem>
                      <SelectItem value="low">Low Impact</SelectItem>
                      <SelectItem value="medium">Medium Impact</SelectItem>
                      <SelectItem value="high">High Impact</SelectItem>
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button 
                      variant="outline" 
                      onClick={clearFilters} 
                      className="w-full"
                      data-testid="button-clear-filters"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-4 mb-8 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search automation ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-desktop"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]" data-testid="select-category-desktop">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Complexity Filter */}
            <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
              <SelectTrigger className="w-[180px]" data-testid="select-complexity-desktop">
                <SelectValue placeholder="Complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Complexity</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            {/* ROI Filter */}
            <Select value={selectedROI} onValueChange={setSelectedROI}>
              <SelectTrigger className="w-[180px]" data-testid="select-roi-desktop">
                <SelectValue placeholder="ROI Impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ROI Impact</SelectItem>
                <SelectItem value="low">Low Impact</SelectItem>
                <SelectItem value="medium">Medium Impact</SelectItem>
                <SelectItem value="high">High Impact</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                data-testid="button-clear-filters-desktop"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground" data-testid="text-results-count">
              Showing <span className="font-semibold text-foreground">{filteredIdeas.length}</span> of <span className="font-semibold text-foreground">{automationIdeas.length}</span> automation ideas
            </p>
          </div>

          {/* Automation Ideas Grid */}
          {filteredIdeas.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No automation ideas found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search query
              </p>
              <Button variant="outline" onClick={clearFilters} data-testid="button-clear-filters-empty">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((idea) => (
                <Card 
                  key={idea.id} 
                  className="hover-elevate flex flex-col h-full"
                  data-testid={`card-automation-${idea.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {categoryLabels[idea.category]}
                      </Badge>
                      <div className="flex gap-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs border ${getComplexityColor(idea.complexity)}`}
                        >
                          {complexityLabels[idea.complexity]}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{idea.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {idea.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="space-y-3">
                      {/* ROI Impact */}
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-sm text-muted-foreground">ROI Impact:</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs border ${getROIColor(idea.roiImpact)}`}
                          >
                            {roiImpactLabels[idea.roiImpact]}
                          </Badge>
                        </div>
                      </div>

                      {/* Time to Implement */}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">{idea.timeToImplement}</span>
                      </div>

                      {/* Potential Savings */}
                      <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Saves:</span>
                        <span className="font-medium text-primary">{idea.potentialSavings}</span>
                      </div>

                      {/* Prerequisites */}
                      {idea.prerequisites && idea.prerequisites.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Prerequisites:</p>
                          <div className="flex flex-wrap gap-1">
                            {idea.prerequisites.map((prereq, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {prereq}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-2 pt-4 border-t">
                    {idea.relatedPlaybook && (
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        data-testid={`button-playbook-${idea.id}`}
                      >
                        <Link href={idea.relatedPlaybook}>
                          View Related Playbook
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    )}
                    <Button 
                      asChild 
                      variant="default" 
                      size="sm" 
                      className="w-full"
                      data-testid={`button-discuss-${idea.id}`}
                    >
                      <Link href="/book-demo">
                        Talk to Us About This
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Automate Your PBSA Operations?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Book a demo to see how TermFlow can implement these automation ideas for your property portfolio. Check out our{" "}
            <Link href="/playbooks" className="text-white hover:underline" data-testid="link-playbooks">
              complete playbooks library
            </Link>
            {" "}for detailed workflows, or{" "}
            <Link href="/start-here" className="text-white hover:underline" data-testid="link-start-here">
              start here
            </Link>
            {" "}to learn about implementation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" data-testid="button-cta-demo">
              <Link href="/book-demo">
                Book a Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" data-testid="button-cta-roi">
              <Link href="/roi-calculator">
                Calculate Your ROI
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
