import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { SiteSearch } from "@/components/SiteSearch";
import { Calendar, Clock, Eye, ArrowLeft, Linkedin, Mail } from "lucide-react";
import { format } from "date-fns";
import { Helmet } from "react-helmet-async";
import { getAuthorBySlug } from "@/data/authors";

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

export default function Author() {
  const [, params] = useRoute<{ slug: string }>("/author/:slug");
  const authorSlug = params?.slug;

  // Get author from registry
  const author = authorSlug ? getAuthorBySlug(authorSlug) : undefined;

  // Fetch blog posts by this author
  const { data: posts, isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: [`/api/blog/posts`, { author: authorSlug }],
    enabled: !!authorSlug,
  });

  if (!author) {
    return (
      <div className="min-h-screen bg-tf-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Author Not Found</h1>
          <Button variant="outline" data-testid="button-back-to-blog" asChild>
            <Link href="/blog">
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Generate initials for avatar fallback
  const initials = author.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  // Generate Person schema for SEO
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author.name,
    "jobTitle": author.title,
    "description": author.bio,
    "image": author.headshot,
    "url": `https://termflow.co.uk/author/${author.slug}`,
    "sameAs": [author.linkedinUrl],
    "worksFor": {
      "@type": "Organization",
      "name": "TermFlow"
    }
  };

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title={`${author.name} - ${author.title} | TermFlow`}
        description={`Read articles by ${author.name}, ${author.title} at TermFlow. ${author.bio.substring(0, 150)}...`}
        keywords={`${author.name}, PBSA expert, student lettings, PropTech, automation`}
        canonical={`https://termflow.co.uk/author/${author.slug}`}
        ogTitle={`${author.name} - ${author.title}`}
        ogDescription={author.bio}
        ogType="profile"
        ogUrl={`https://termflow.co.uk/author/${author.slug}`}
        ogImage={author.headshot}
        twitterImage={author.headshot}
      />

      {/* Person Schema */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(personSchema)}
        </script>
      </Helmet>

      {/* Breadcrumb Schema */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: author.name, url: `/author/${author.slug}` }
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

      {/* Author Profile Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8" data-testid="breadcrumb">
          <Link href="/" className="hover:text-foreground">Home</Link>
          {' / '}
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          {' / '}
          <span className="text-foreground">{author.name}</span>
        </nav>

        {/* Profile Card */}
        <Card className="mb-12 border-2 border-primary/20" data-testid="card-author-profile">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-32 w-32 border-4 border-primary/20" data-testid="avatar-author">
                  <AvatarImage src={author.headshot} alt={author.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-author-name">
                  {author.name}
                </h1>
                <p className="text-lg text-primary font-semibold mb-4" data-testid="text-author-title">
                  {author.title}
                </p>

                <p className="text-base text-muted-foreground mb-6 leading-relaxed" data-testid="text-author-bio">
                  {author.bio}
                </p>

                {/* Credentials */}
                {author.credentials && author.credentials.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Credentials & Experience</h3>
                    <ul className="space-y-2">
                      {author.credentials.map((credential, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground" data-testid={`credential-${index}`}>
                          <Badge variant="outline" className="mt-0.5 flex-shrink-0">✓</Badge>
                          <span>{credential}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" asChild data-testid="button-linkedin">
                    <a href={author.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      Connect on LinkedIn
                    </a>
                  </Button>
                  {author.email && (
                    <Button variant="outline" size="sm" asChild data-testid="button-email">
                      <a href={`mailto:${author.email}`} className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles by Author */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6" data-testid="heading-articles">
            Articles by {author.name}
          </h2>

          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            data-testid={`img-post-${post.slug}`}
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${post.slug}`}>
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
            <Card className="p-12 text-center" data-testid="card-no-posts">
              <p className="text-lg text-muted-foreground">
                No articles published yet. Check back soon!
              </p>
            </Card>
          )}
        </div>
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
