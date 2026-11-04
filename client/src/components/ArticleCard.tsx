import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { Article, articleCategories } from "@/data/articles";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const category = articleCategories.find(cat => cat.id === article.category);

  return (
    <Link href={`/knowledge-base/${article.slug}`}>
      <Card 
        className={`hover-elevate cursor-pointer h-full transition-all duration-200 ${
          featured ? 'border-tf-lime/30' : ''
        }`}
        data-testid={`card-article-${article.slug}`}
      >
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {category?.name || article.category}
            </Badge>
            {featured && (
              <Badge className="bg-tf-lime text-tf-navy text-xs">
                Featured
              </Badge>
            )}
          </div>
          
          <CardTitle className={`line-clamp-2 ${featured ? 'text-xl' : 'text-lg'}`}>
            {article.title}
          </CardTitle>
          
          <CardDescription className="line-clamp-3 text-sm">
            {article.excerpt}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{article.readTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.publishDate).toLocaleDateString('en-GB', { 
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}</span>
              </div>
            </div>
            
            <ArrowRight className="h-4 w-4 text-tf-lime" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
