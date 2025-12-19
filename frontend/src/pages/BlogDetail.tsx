import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Calendar, User, ArrowLeft, Share2, Clock } from 'lucide-react'
import SEO from '../components/SEO'

const backendUrl = import.meta.env.VITE_BACKEND_URL

interface Blog {
  _id: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  author: string
  slug: string
  readTime: string
  category: string
}

interface BlogPostContent {
  id: string
  title: string
  excerpt: string
  content: string
  imageUrl: string
  date: string
  dateISO: string
  author: string
  readTime: string
  category: string
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPostContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const linkify = (text: string) => {
    // Determine if text looks like HTML (has tags)
    const hasTags = /<[a-z][\s\S]*>/i.test(text);

    if (hasTags) {
      // If it has tags, we only want to linkify text nodes that strictly contain URLs 
      // AND are not already inside an <a> tag.
      // BUT, parsing HTML in a string replacement is brittle. 
      // Simple heuristic: If the text is FULL of HTML, we might assume the user 
      // provided their own links for the URLs that matter.
      // However, to be helpful, we can try to linkify *only* plain text URLs that 
      // are NOT inside href attributes and NOT between > and </a>.
      
      // A safer approach for Mixed content:
      // 1. If it looks like raw HTML, trust the user's HTML mostly.
      // 2. But if they wrote "Check this: https://google.com" inside a <p>, we want to linkify it.
      // 3. If they wrote "<a href='...'>https://google.com</a>", we MUST NOT linkify it.
      
      // Negative lookbehind for > (end of tag) might work if we assume well-formed HTML matches.
      // text.replace(/((?<!>|["'])https?:\/\/[^\s<]+)/g ...) 
      // But > is present in <a ...>URL</a>.
      
      // Let's use a temporary DOM parser to be safe.
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      
      const walk = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const parent = node.parentNode as HTMLElement;
          // If parent is <a>, do not touch.
          if (parent && parent.tagName !== 'A' && parent.tagName !== 'SCRIPT' && parent.tagName !== 'STYLE') {
            const content = node.textContent || '';
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            if (urlRegex.test(content)) {
               // We need to replace this text node with a fragment of nodes (text + a + text)
               // But we can't easily return it here to stringify later.
               // Easier: Do regex replacement on the textContent, but we are working on a DOM.
               // We can update the parent's innerHTML? No, that destroys siblings.
               // We can replace the node.
               
               const matches = content.split(urlRegex);
               // Interleave: even indices are text, odd are URLs (capturing group).
               // content: "Visit https://foo.com now" -> ["Visit ", "https://foo.com", " now"]
               
               if (matches.length > 1) {
                  const fragment = document.createDocumentFragment();
                  matches.forEach((part, i) => {
                    if (i % 2 === 1) { // URL
                      const a = document.createElement('a');
                      a.href = part;
                      a.target = "_blank";
                      a.rel = "noopener noreferrer";
                      a.className = "text-blue-600 hover:underline break-words";
                      a.textContent = part;
                      fragment.appendChild(a);
                    } else {
                      fragment.appendChild(document.createTextNode(part));
                    }
                  });
                  parent.replaceChild(fragment, node);
               }
            }
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
           (node as Element).childNodes.forEach(child => walk(child));
        }
      };
      
      doc.body.childNodes.forEach(child => walk(child));
      return doc.body.innerHTML; 
    } else {
      // Plain text fallback
      const urlRegex = /(?<!['"])(https?:\/\/[^\s<]+)/g;
      return text.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline break-words">${url}</a>`;
      })
    }
  }

  useEffect(() => {
    async function fetchBlog() {
      if (!slug) {
        setError('Blog post not found')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      try {
        const res = await fetch(backendUrl + `/api/blog/slug/${encodeURIComponent(slug)}`)
        if (!res.ok) {
          setError('Failed to load blog (server error)')
          setLoading(false)
          return
        }
        const data: { success: boolean; blog?: Blog; message?: string } = await res.json()
        if (data.success) {
          const found = data.blog
          if (!found) {
            setError('Blog post not found')
            setLoading(false)
            return
          }

          const publishedISO = new Date(found.date).toISOString();
          setPost({
            id: found._id,
            title: found.title,
            excerpt: found.excerpt,
            content: linkify(decodeHtml(found.content || '')),
            imageUrl: found.image,
            date: new Date(found.date).toLocaleDateString(),
            dateISO: publishedISO,
            author: found.author,
            readTime: found.readTime,
            category: found.category
          })
        } else {
          setError(data.message || 'Failed to load blog')
        }
      } catch (err) {
        setError('Could not connect to blog API. Check your backend URL and CORS.')
      }
      setLoading(false)
    }
    fetchBlog()
  }, [slug])

  const handleShare = async () => {
    try {
      const blogUrl = window.location.href
      await navigator.clipboard.writeText(blogUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000) // Hide success message after 2 seconds
    } catch (err) {
      console.error('Failed to copy URL to clipboard:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr)
      }
      document.body.removeChild(textArea)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading blog...</div>
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  }
  if (!post) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Blog post not found</div>
  }

  return (
    <div className="min-h-screen bg-white ">
      <SEO 
        title={post ? `${post.title.replace(/<[^>]*>?/gm, '')} - Blog` : "Blog Post"}
        description={post ? post.excerpt : "Read our latest fashion blog post at Revive Wardrobe"}
        keywords={post ? `${post.category}, fashion blog, style guide, ${post.title.replace(/<[^>]*>?/gm, '')}, buy clothes online dubai, online fashion store uae, dubai clothing store, modest fashion dubai, shein dubai uae online, online clothes shopping uae, abaya online uae, zara uae online, shein online shopping dubai, matalan uae online, order clothes online dubai, best abaya shops in Dubai, Dubai abaya online worldwide shipping, abaya shop Dubai online, luxury abaya Dubai online` : "fashion blog, style guide, buy clothes online dubai, online fashion store uae, dubai clothing store, modest fashion dubai, shein dubai uae online, online clothes shopping uae, abaya online uae, zara uae online, shein online shopping dubai, matalan uae online, order clothes online dubai, best abaya shops in Dubai, Dubai abaya online worldwide shipping, abaya shop Dubai online, luxury abaya Dubai online"}
        canonical={`/blog/${slug}`}
        ogImage={post?.imageUrl}
        ogType="article"
        jsonLd={(() => {
          const siteUrl = 'https://revivewardrobe.com';
          const url = `${siteUrl}/blog/${slug}`;
          const cleanTitle = post.title.replace(/<[^>]*>?/gm, '');
          return {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: cleanTitle,
            description: post.excerpt,
            image: post.imageUrl ? [post.imageUrl] : undefined,
            author: {
              '@type': 'Person',
              name: post.author
            },
            publisher: {
              '@type': 'Organization',
              name: 'Revive Wardrobe',
              logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logo.png`
              }
            },
            datePublished: post.dateISO,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': url
            },
            url
          };
        })()}
      />
      <Navbar />
      <div className="pt-20 md:pt-28 pb-16 ">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-gray-600 hover:text-revive-red transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Blog
            </Link>
          </div>
          {/* Blog Header */}
          <div className="max-w-3xl mx-auto mb-8">
            <h1 className="text-2xl md:text-4xl font-serif mb-6" dangerouslySetInnerHTML={{ __html: post.title }} />
            <div className="flex flex-wrap items-center text-gray-500 mb-6 gap-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
          {/* Featured Image */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="rounded-lg overflow-hidden h-72 md:h-96">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Blog Content */}
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            {/* Share Links */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center">
                <span className="text-gray-600 mr-4">Share this article:</span>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleShare}
                    className="text-gray-500 hover:text-revive-red transition-colors flex items-center"
                    title="Copy link to clipboard"
                  >
                    <Share2 size={18} />
                  </button>
                  {copySuccess && (
                    <span className="text-green-600 text-sm">Link copied to clipboard!</span>
                  )}
                </div>
              </div>
            </div>
            {/* Related Posts Teaser (optional: can fetch and show more) */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default BlogDetail
