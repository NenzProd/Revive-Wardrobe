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
  keywords,
  canonical,
  ogImage = '/logo.png',
  ogType = 'website'
}: SEOProps) => {
  const baseDefaultKeywords = 'fashion, clothing, online shopping, revive wardrobe, buy clothes online dubai, online fashion store uae, dubai clothing store, modest fashion dubai, shein dubai uae online, online clothes shopping uae, abaya online uae, zara uae online, shein online shopping dubai, matalan uae online, order clothes online dubai, best abaya shops in Dubai, Dubai abaya online worldwide shipping, abaya shop Dubai online, luxury abaya Dubai online';
  const extraKeywords = [
    'Luxury modest wear Dubai',
    'Premium abayas UAE',
    'Designer jalebia dresses Middle East',
    'Elegant modest wardrobe Dubai',
    'Buy abayas online in Dubai',
    'Custom stitched jalebias UAE',
    'Luxury modest dresses for women Dubai',
    'Tailored couple outfits Middle East',
    'Affordable modest fashion GCC',
    'buy abaya dubai',
    'abaya shops in dubai online',
    'dubai pardha online shopping',
    'dubai designer abaya online shopping',
    'latest jalabiya designs in dubai',
    'jalabiya shops in dubai',
    'jalabiya dubai online',
    'abaya jalabiya dress dubai',
    'jalabiya dubai',
    'luxury embroidered jalabiya Dubai',
    'designer casual jalabiya UAE online',
    'Dubai evening jalabiya online shop',
    'best jalabiya store UAE online',
    'premium embroidered jalabiya dubai online'
  ];
  const computeKeywords = (incoming?: string) => {
    const base = baseDefaultKeywords.split(',').map(s => s.trim()).filter(Boolean);
    const incomingList = incoming ? incoming.split(',').map(s => s.trim()).filter(Boolean) : [];
    const combined = [...base, ...incomingList, ...extraKeywords];
    const dedupMap = new Map<string, string>();
    combined.forEach(k => {
      const key = k.toLowerCase();
      if (!dedupMap.has(key)) dedupMap.set(key, k);
    });
    return Array.from(dedupMap.values()).join(', ');
  };
  const siteUrl = 'https://revivewardrobe.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullTitle = `${title} | Revive Wardrobe`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={computeKeywords(keywords)} />
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
