import { useRoute } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArticleCard } from "@/components/ArticleCard";
import { Footer } from "@/components/Footer";
import { TermFlowWordmark } from "@/components/TermFlowLogo";
import { Clock, Calendar, ArrowLeft, Share2, BookmarkPlus } from "lucide-react";
import { getArticleBySlug, getRelatedArticles, articleCategories } from "@/data/articles";
import ReactMarkdown from "react-markdown";

export default function KnowledgeBaseArticle() {
  const [, params] = useRoute("/knowledge-base/:slug");
  const article = params?.slug ? getArticleBySlug(params.slug) : undefined;

  if (!article) {
    return (
      <div className="min-h-screen bg-tf-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
          <Button asChild>
            <a href="/knowledge-base">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Knowledge Base
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const category = articleCategories.find(cat => cat.id === article.category);
  const relatedArticles = getRelatedArticles(article.slug, article.category, 3);

  // Extract H2 headings for table of contents
  const headings = article.content.match(/^## .+$/gm) || [];
  const tableOfContents = headings.map(h => ({
    text: h.replace('## ', ''),
    id: h.replace('## ', '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }));

  return (
    <div className="min-h-screen bg-tf-bg">
      <SEOHead
        title={`${article.title} | TermFlow Knowledge Base`}
        description={article.metaDescription}
        keywords={article.keywords.join(', ')}
        canonical={`https://termflow.co.uk/knowledge-base/${article.slug}`}
        ogTitle={article.title}
        ogDescription={article.metaDescription}
        ogType="article"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 w-full bg-gradient-to-r from-tf-navy via-tf-navy-700 to-tf-navy-900" />
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/">
            <TermFlowWordmark />
          </a>
          <div className="flex items-center gap-4">
            <a href="/knowledge-base" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-knowledge-base">
              <ArrowLeft className="h-4 w-4 inline mr-1" />
              Knowledge Base
            </a>
            <Button variant="default" size="sm" asChild className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90" data-testid="button-book-demo">
              <a href="/book-demo">Book Demo</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <a href="/knowledge-base" className="hover:text-foreground" data-testid="breadcrumb-knowledge-base">Knowledge Base</a>
          <span>/</span>
          <span className="text-foreground">{article.title}</span>
        </div>
      </div>

      {/* Article Hero */}
      <article className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            {category?.name || article.category}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{article.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.publishDate).toLocaleDateString('en-GB', { 
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</span>
            </div>
            <div>
              By {article.author}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" data-testid="button-share">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" data-testid="button-save">
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Table of Contents */}
        {tableOfContents.length > 0 && (
          <Card className="p-6 mb-8 bg-muted/30">
            <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
            <ul className="space-y-2">
              {tableOfContents.map((heading, index) => (
                <li key={index}>
                  <a 
                    href={`#${heading.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline"
                    data-testid={`toc-link-${index}`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-foreground
            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-foreground prose-p:leading-relaxed
            prose-a:text-tf-lime prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-ul:text-foreground prose-ol:text-foreground
            prose-li:marker:text-tf-lime
            prose-code:text-tf-lime prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-blockquote:border-l-tf-lime prose-blockquote:text-muted-foreground
            prose-table:text-foreground
            prose-th:bg-muted prose-th:font-semibold
            prose-td:border-border"
        >
          <ReactMarkdown
            components={{
              h2: ({ node, ...props }) => {
                const text = String(props.children);
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return <h2 id={id} {...props} />;
              },
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* CTA Section */}
        <div className="mt-12 p-8 bg-gradient-to-r from-tf-navy to-tf-navy-700 rounded-lg text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Transform Your Student Lettings?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            See how TermFlow automates your entire lettings cycle, from enquiry to contract, with 24/7 AI assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-tf-lime text-tf-navy hover:bg-tf-lime/90 font-semibold" data-testid="button-cta-book-demo">
              <a href="/book-demo">Book a Free Demo</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10" data-testid="button-cta-case-studies">
              <a href="/case-studies">View Case Studies</a>
            </Button>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map(relatedArticle => (
              <ArticleCard key={relatedArticle.slug} article={relatedArticle} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
