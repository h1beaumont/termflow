import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";
import { Calendar, Clock, Eye, ArrowLeft, TrendingUp, Award, Linkedin } from "lucide-react";
import { format } from "date-fns";
import { Helmet } from "react-helmet-async";
import { getAuthorByName } from "@/data/authors";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  keywords: string;
  content: string;
  excerpt: string;
  coverImageUrl: string | null;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTimeMinutes: number;
  viewCount: number;
  authorName: string;
}

export default function BlogPost() {
  const [, params] = useRoute<{ slug: string }>("/blog/:slug");
  const slug = params?.slug;

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: [`/api/blog/posts/${slug}`],
    enabled: !!slug,
  });

  // Get author data from registry
  const author = post ? getAuthorByName(post.authorName) : undefined;
  const authorInitials = author ? author.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'A';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-tf-bg flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-tf-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Button variant="outline" data-testid="button-back-to-blog" asChild>
            <Link href="/blog">
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Generate Article schema for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.metaDescription,
    "image": post.coverImageUrl || "https://termflow.co.uk/og-image.png",
    "author": {
      "@type": "Person",
      "name": post.authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "TermFlow",
      "logo": {
        "@type": "ImageObject",
        "url": "https://termflow.co.uk/logo.png"
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "keywords": post.keywords,
    "articleSection": post.category,
    "wordCount": post.content.split(/\s+/).length,
    "timeRequired": `PT${post.readingTimeMinutes}M`
  };

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title={`${post.title} | TermFlow Blog`}
        description={post.metaDescription}
        keywords={post.keywords}
        canonical={`https://termflow.co.uk/blog/${post.slug}`}
        ogTitle={post.title}
        ogDescription={post.metaDescription}
        ogType="article"
        ogUrl={`https://termflow.co.uk/blog/${post.slug}`}
        ogImage={post.coverImageUrl || "https://termflow.co.uk/og-image-default.png"}
        twitterImage={post.coverImageUrl || "https://termflow.co.uk/og-image-default.png"}
      />

      {/* Article Schema */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      {/* Breadcrumb Schema */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` }
        ]}
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
            <Link href="/blog" className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1" data-testid="link-blog">
              <ArrowLeft className="w-4 h-4" />
              Blog
            </Link>
            <Button variant="default" size="sm" asChild data-testid="button-book-demo">
              <Link href="/book-demo">Book Demo</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6" data-testid="breadcrumb">
          <Link href="/" className="hover:text-foreground">Home</Link>
          {' / '}
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          {' / '}
          <span className="text-foreground">{post.title}</span>
        </nav>

        {/* Category Badge */}
        <Badge variant="secondary" className="mb-4" data-testid="badge-category">
          {post.category}
        </Badge>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4" data-testid="title-post">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.readingTimeMinutes} min read
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {post.viewCount} views
          </div>
          <div>
            By{' '}
            {author ? (
              <Link href={`/author/${author.slug}`} className="text-primary hover:text-primary/80 font-medium transition-colors" data-testid="link-author">
                {post.authorName}
              </Link>
            ) : (
              <span>{post.authorName}</span>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <img 
            src={post.coverImageUrl} 
            alt={post.title}
            className="w-full rounded-lg mb-8"
            loading="lazy"
          />
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none" 
          data-testid="content-post"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-sm font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs" data-testid={`tag-${tag}`}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        {author && (
          <Card className="mt-12 border-2 border-primary/20 hover-elevate" data-testid="card-author-bio">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Link href={`/author/${author.slug}`} data-testid="link-author-avatar">
                  <Avatar className="h-24 w-24 border-2 border-primary/20 hover-elevate transition-all">
                    <AvatarImage src={author.headshot} alt={author.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                      {authorInitials}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <Link href={`/author/${author.slug}`} data-testid="link-author-name">
                      <h3 className="text-xl font-bold text-foreground hover:text-primary transition-colors">
                        {author.name}
                      </h3>
                    </Link>
                    <a 
                      href={author.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                      data-testid="link-author-linkedin"
                      aria-label="Connect on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3" data-testid="text-author-title">
                    {author.title}
                  </p>
                  <p className="text-sm text-foreground leading-relaxed mb-4" data-testid="text-author-bio">
                    {author.bio.split('.')[0]}.{author.bio.split('.')[1] ? ' ' + author.bio.split('.')[1] + '.' : ''}
                  </p>
                  <Button variant="outline" size="sm" asChild data-testid="link-view-profile">
                    <Link href={`/author/${author.slug}`}>
                      View Full Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Case Study CTA */}
        <div className="mt-12 p-8 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg border-2 border-primary/20">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-primary/20">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">See TermFlow in Action</h3>
              <p className="text-muted-foreground">
                See how operators automated 95% of their lettings process with TermFlow - from enquiry to signed contract.
              </p>
            </div>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" data-testid="button-cta-case-study">
              <Link href="/case-studies" className="gap-2">
                <Award className="h-4 w-4" />
                Read Case Studies
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" data-testid="button-cta-book-demo-case">
              <Link href="/book-demo">Book Your Demo</Link>
            </Button>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-tf-navy/5 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Automate Your Student Lettings?</h3>
          <p className="text-muted-foreground mb-6">
            See how TermFlow can save you 20+ hours/week with AI automation
          </p>
          <Button size="lg" asChild data-testid="button-cta-demo">
            <Link href="/book-demo">Book a Free Demo</Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
