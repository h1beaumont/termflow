import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Home, Search, BookOpen, Calculator, FileText, ArrowLeft, Mail } from "lucide-react";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { useState } from "react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to blog with search query
      setLocation(`/blog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickLinks = [
    {
      title: "Homepage",
      description: "Return to our main page",
      href: "/",
      icon: Home
    },
    {
      title: "How It Works",
      description: "Learn about TermFlow",
      href: "/how-it-works",
      icon: BookOpen
    },
    {
      title: "ROI Calculator",
      description: "Calculate your savings",
      href: "/roi-calculator",
      icon: Calculator
    },
    {
      title: "Book a Demo",
      description: "See TermFlow in action",
      href: "/book-demo",
      icon: Mail
    },
    {
      title: "Blog",
      description: "Read our latest insights",
      href: "/blog",
      icon: FileText
    },
    {
      title: "Pricing",
      description: "View our pricing plans",
      href: "/pricing",
      icon: Calculator
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-tf-navy/5 via-background to-tf-lime/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-lime" />
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <TermFlowWordmark />
          <Button variant="ghost" size="sm" asChild data-testid="button-back">
            <a href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </a>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* 404 Message */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-tf-navy to-tf-lime" data-testid="text-404">
              404
            </h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Use the search below or explore our quick links to find what you need.
          </p>
        </div>

        {/* Search */}
        <Card className="mb-12" data-testid="card-search">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Our Site
            </CardTitle>
            <CardDescription>
              Looking for something specific? Search our blog and resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search for student lettings, automation, PBSA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                data-testid="input-search"
              />
              <Button type="submit" data-testid="button-search">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div>
          <h3 className="text-2xl font-bold mb-6 text-center">Quick Links</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                  key={index}
                  href={link.href}
                  className="group"
                  data-testid={`link-quick-${index}`}
                >
                  <Card className="h-full hover-elevate transition-all">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-tf-navy to-tf-navy-700 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base group-hover:text-tf-navy transition-colors">
                            {link.title}
                          </CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {link.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still can't find what you're looking for?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild data-testid="button-contact">
              <a href="/contact">
                <Mail className="w-5 h-5 mr-2" />
                Contact Support
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-demo">
              <a href="/book-demo">
                Book a Demo
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
