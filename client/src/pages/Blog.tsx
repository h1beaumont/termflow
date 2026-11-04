import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Eye } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  coverImageUrl: string | null;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTimeMinutes: number;
  viewCount: number;
  authorName: string;
}

export default function Blog() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
  });

  const categories = Array.from(new Set(posts?.map(p => p.category) || []));

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title="Blog | TermFlow - Student Lettings Automation Insights"
        description="Expert insights on student accommodation automation, PBSA operations, AI lettings, and property management best practices. Tips to save 20+ hours/week."
        keywords="student lettings blog, PBSA operations, AI automation insights, property management tips, student accommodation"
        canonical="https://termflow.co.uk/blog"
        ogTitle="TermFlow Blog - Student Lettings & PBSA Automation Insights"
        ogDescription="Expert insights on automating student lettings, PBSA operations, and property management. Save time and increase conversions."
        ogType="website"
        ogUrl="https://termflow.co.uk/blog"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" data-testid="link-home">
              <TermFlowWordmark />
            </Link>
            <SiteSearch />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm font-semibold text-muted-foreground hover:text-foreground" data-testid="link-pricing">
              Pricing
            </Link>
            <Button variant="default" size="sm" asChild data-testid="button-book-demo">
              <Link href="/book-demo">Book Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-tf-navy/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            TermFlow Blog
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Expert insights on student lettings automation, PBSA operations, and property management best practices
          </p>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(cat => (
                <Badge key={cat} variant="outline" className="text-sm" data-testid={`badge-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}>
                  {cat}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse" data-testid={`skeleton-post-${i}`}>
                <CardHeader>
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} data-testid={`link-post-${post.slug}`}>
                <Card className="h-full hover-elevate active-elevate-2 transition-all">
                    {post.coverImageUrl && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <img 
                          src={post.coverImageUrl} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${post.category}`}>
                          {post.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readingTimeMinutes} min read
                        </span>
                      </div>
                      <CardTitle className="text-xl line-clamp-2" data-testid={`title-${post.slug}`}>
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3" data-testid={`excerpt-${post.slug}`}>
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.publishedAt && format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.viewCount} views
                      </div>
                    </CardFooter>
                  </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No blog posts published yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-transparent to-tf-navy/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Student Lettings?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join leading PBSA operators saving 20+ hours/week with AI automation
          </p>
          <Button size="lg" asChild data-testid="button-cta-demo">
            <Link href="/book-demo" className="text-lg px-8">Book a Demo</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
