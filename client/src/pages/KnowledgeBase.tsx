import { useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/ArticleCard";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Search, BookOpen, GraduationCap, TrendingUp, Shield, Zap } from "lucide-react";
import { articles, articleCategories, getFeaturedArticles } from "@/data/articles";

const categoryIcons: Record<string, any> = {
  'getting-started': GraduationCap,
  'best-practices': TrendingUp,
  'compliance': Shield,
  'technology': Zap,
};

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const featuredArticles = getFeaturedArticles();

  // Filter articles based on search and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="Knowledge Base - PBSA Education & Resources | TermFlow"
        description="Comprehensive guides, best practices, and insights for student accommodation landlords. Learn about PBSA, compliance, automation, and proven lettings strategies."
        keywords="PBSA guide, student lettings best practices, property compliance, lettings automation, student accommodation education"
        canonical="https://termflow.co.uk/knowledge-base"
        ogTitle="Knowledge Base - PBSA Education & Resources | TermFlow"
        ogDescription="Everything you need to know about student accommodation management - from getting started with PBSA to advanced automation strategies."
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/">
            <TermFlowWordmark />
          </a>
          <div className="flex items-center gap-4">
            <a href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <Button variant="default" size="sm" asChild className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90">
              <a href="/book-demo">Book Demo</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-tf-navy via-tf-navy-700 to-tf-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-tf-lime" />
            <h1 className="text-4xl md:text-5xl font-bold">
              PBSA Education & Resources
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Everything you need to know about student accommodation management, from getting started with PBSA to advanced automation strategies.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles by topic, keyword, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white text-foreground"
                data-testid="input-knowledge-base-search"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? "bg-tf-lime text-tf-navy hover:bg-tf-lime/90" : ""}
            data-testid="button-category-all"
          >
            All Articles ({articles.length})
          </Button>
          {articleCategories.map((category) => {
            const Icon = categoryIcons[category.id];
            const count = articles.filter(a => a.category === category.id).length;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-tf-lime text-tf-navy hover:bg-tf-lime/90" : ""}
                data-testid={`button-category-${category.id}`}
              >
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                {category.name} ({count})
              </Button>
            );
          })}
        </div>
      </section>

      {/* Featured Articles */}
      {!searchQuery && !selectedCategory && featuredArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold">Featured Articles</h2>
            <Badge className="bg-tf-lime text-tf-navy">Popular</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map(article => (
              <ArticleCard key={article.slug} article={article} featured />
            ))}
          </div>
        </section>
      )}

      {/* All Articles / Search Results */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">
          {searchQuery ? `Search Results (${filteredArticles.length})` : 
           selectedCategory ? `${articleCategories.find(c => c.id === selectedCategory)?.name} (${filteredArticles.length})` :
           `All Articles (${filteredArticles.length})`}
        </h2>
        
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No articles found matching your criteria. Try a different search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-tf-navy to-tf-navy-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Automate Your Student Lettings?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            See how TermFlow helps PBSA landlords reduce management time by 95% while increasing conversions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90 font-semibold">
              <a href="/book-demo">Book a Free Demo</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
              <a href="/case-studies">View Case Studies</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
