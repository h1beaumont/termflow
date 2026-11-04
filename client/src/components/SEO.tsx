import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogUrl?: string;
  ogImage?: string;
  ogSiteName?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
  structuredData?: any;
  alternateLanguages?: { lang: string; href: string }[];
  noindex?: boolean;
  nofollow?: boolean;
}

export function SEO({
  title,
  description,
  keywords = "student lettings automation, PBSA software, student accommodation management, automated tenant onboarding, student housing platform UK, proptech student accommodation, Right to Rent checks, deposit protection, AI lettings, student accommodation CRM",
  canonical,
  ogTitle,
  ogDescription,
  ogType = "website",
  ogUrl,
  ogImage = "https://termflow.co.uk/og-image.jpg",
  ogSiteName = "TermFlow",
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterSite = "@termflow",
  article,
  structuredData,
  alternateLanguages,
  noindex = false,
  nofollow = false,
}: SEOProps) {
  // Use og values as fallbacks for Twitter if not provided
  const finalTwitterTitle = twitterTitle || ogTitle || title;
  const finalTwitterDescription = twitterDescription || ogDescription || description;
  const finalTwitterImage = twitterImage || ogImage;

  // Default base URL
  const baseUrl = "https://termflow.co.uk";
  const finalCanonical = canonical || (typeof window !== "undefined" ? window.location.href : baseUrl);
  const finalOgUrl = ogUrl || finalCanonical;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="TermFlow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
      <meta httpEquiv="content-language" content="en-GB" />
      
      {/* Robots Meta Tags */}
      {(noindex || nofollow) && (
        <meta 
          name="robots" 
          content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`} 
        />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonical} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={finalOgUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={`${ogTitle || title} - TermFlow`} />
      <meta property="og:site_name" content={ogSiteName} />
      <meta property="og:locale" content="en_GB" />
      
      {/* Article specific Open Graph tags */}
      {article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.tags && article.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalTwitterTitle} />
      <meta name="twitter:description" content={finalTwitterDescription} />
      {finalTwitterImage && <meta name="twitter:image" content={finalTwitterImage} />}
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      
      {/* Alternate Languages */}
      {alternateLanguages && alternateLanguages.map((alt, index) => (
        <link key={index} rel="alternate" hrefLang={alt.lang} href={alt.href} />
      ))}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Additional SEO Tags */}
      <meta name="geo.region" content="GB" />
      <meta name="geo.placename" content="United Kingdom" />
      <meta name="theme-color" content="#14213D" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="TermFlow" />
      <meta name="application-name" content="TermFlow" />
      <meta name="msapplication-TileColor" content="#14213D" />
    </Helmet>
  );
}