import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const SEO = ({ 
  title, 
  description, 
  keywords,
  canonical,
  ogImage = '/logo.png',
  ogType = 'website',
  jsonLd
}: SEOProps) => {
  const baseDefaultKeywords = 'buy clothes online dubai, online fashion store uae, dubai clothing store, modest fashion dubai, online clothes shopping uae, abaya online uae, order clothes online dubai, best abaya shops in Dubai';
  const extraKeywords = [
    'shein dubai uae online',
    'zara uae online', 
    'shein online shopping dubai',
    'matalan uae online',
    'Dubai abaya online worldwide shipping',
    'abaya shop Dubai online',
    'luxury abaya Dubai online',
    'designer jalabiyas uae' // Keeping this relevant one
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

  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;

  const organizationSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: 'Revive Wardrobe',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      'https://www.facebook.com/revivewardrobe/',
      'https://www.instagram.com/revivewardrobe_uae/'
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'info@revivewardrobe.com',
        availableLanguage: ['en']
      }
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ras Al Khaimah',
      addressCountry: 'AE'
    }
  };

  const websiteSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    url: siteUrl,
    name: 'Revive Wardrobe',
    publisher: { '@id': organizationId },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/shop/search/{search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  const webPageSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: fullCanonical,
    name: fullTitle,
    description,
    isPartOf: { '@id': websiteId },
    about: { '@id': organizationId }
  };

  const normalizeJsonLd = (value?: SEOProps['jsonLd']) => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  };

  const jsonLdScripts = [organizationSchema, websiteSchema, webPageSchema, ...normalizeJsonLd(jsonLd)];

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

      {jsonLdScripts.map((schema, idx) => (
        <script
          key={`jsonld-${idx}`}
          type="application/ld+json"
        >
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
