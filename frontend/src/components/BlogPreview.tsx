
import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOptimizedImageUrl, getOptimizedSrcSet } from '../lib/image';

const backendUrl = import.meta.env.VITE_BACKEND_URL

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  slug: string;
  category: string;
}

interface BlogPostProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  author: string;
  link: string;
  category: string;
  priority?: boolean;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, excerpt, imageUrl, date, author, link, category, priority }) => {
  const src = getOptimizedImageUrl(imageUrl, { width: 900, quality: 'auto:eco', crop: 'fill' });
  const srcSet = getOptimizedSrcSet(imageUrl, [420, 720, 900, 1200], { quality: 'auto:eco', crop: 'fill' });

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="h-56 overflow-hidden">
        <img 
          src={src} 
          srcSet={srcSet}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          alt={title}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs mb-3">{category}</span>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar size={14} className="mr-1" />
          <span>{date} by {author}</span>
        </div>
        <h3 className="text-xl font-serif mb-3 group-hover:text-revive-red transition-colors">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{excerpt}</p>
        <Link 
          to={link} 
          className="inline-flex items-center text-revive-red hover:text-revive-black transition-colors"
        >
          Read More <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

const BlogPreview = () => {
  const [blogs, setBlogs] = useState<BlogPostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(backendUrl + '/api/blog/list');
        if (!res.ok) {
          setError('Failed to load blogs');
          setLoading(false);
          return;
        }
        const data: { success: boolean; blogs: Blog[]; message?: string } = await res.json();
        if (data.success) {
          // Get only the first 3 blogs for preview
          const previewBlogs = data.blogs.slice(0, 3).map((b) => ({
            title: b.title,
            excerpt: b.excerpt,
            imageUrl: b.image,
            date: new Date(b.date).toLocaleDateString(),
            author: b.author,
            link: `/blog/${b.slug}`,
            category: b.category
          }));
          setBlogs(previewBlogs);
        } else {
          setError(data.message || 'Failed to load blogs');
        }
      } catch (err) {
        setError('Could not connect to blog API');
      }
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Latest from Our Blog</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover style tips, cultural insights, and fashion inspiration to help you express your unique identity.
          </p>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-revive-red"></div>
            <p className="mt-2 text-gray-600">Loading blogs...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-revive-red text-white rounded hover:bg-revive-black transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post, index) => (
              <BlogPost key={post.link} {...post} priority={index === 0} />
            ))}
          </div>
        )}
        
        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No blog posts available at the moment.</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link 
            to="/blog" 
            className="inline-flex items-center px-6 py-3 bg-revive-red text-white rounded-lg hover:bg-revive-black transition-colors"
          >
            View All Posts <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
