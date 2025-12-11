import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

const SEO = ({ 
  title, 
  description, 
  keywords = 'fashion, clothing, online shopping, revive wardrobe, buy clothes online dubai, online fashion store uae, dubai clothing store, modest fashion dubai, shein dubai uae online, online clothes shopping uae, abaya online uae, zara uae online, shein online shopping dubai, matalan uae online, order clothes online dubai, best abaya shops in Dubai, Dubai abaya online worldwide shipping, abaya shop Dubai online, luxury abaya Dubai online',
  canonical,
  ogImage = '/logo.png',
  ogType = 'website'
}: SEOProps) => {
  const siteUrl = 'https://revivewardrobe.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullTitle = `${title} | Revive Wardrobe`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="Revive Wardrobe" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
    </Helmet>
  );
};

export default SEO;
