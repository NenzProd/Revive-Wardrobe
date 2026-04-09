import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowRight, Calendar, Search } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { getOptimizedImageUrl, getOptimizedSrcSet } from "../lib/image";
import { backendUrl } from "../config/constants";

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

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  excerpt,
  imageUrl,
  date,
  author,
  link,
  category,
  priority,
}) => {
  const src = getOptimizedImageUrl(imageUrl, {
    width: 900,
    quality: "auto:eco",
    crop: "fill",
  });
  const srcSet = getOptimizedSrcSet(imageUrl, [420, 720, 900, 1200], {
    quality: "auto:eco",
    crop: "fill",
  });

  return (
    <div className="bg-white/95 rounded-2xl overflow-hidden border border-[#7b4d2e]/10 shadow-[0_16px_40px_rgba(56,37,25,0.09)] hover:shadow-[0_20px_46px_rgba(56,37,25,0.14)] transition-all duration-300 group">
      <div className="h-56 overflow-hidden">
        <img
          src={src}
          srcSet={srcSet}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          alt={title}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <span className="inline-block px-3 py-1 bg-[#f2e7d8] text-[#6d4a35] rounded-full text-xs mb-3 font-medium">
          {category}
        </span>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar size={14} className="mr-1" />
          <span>
            {date} by {author}
          </span>
        </div>
        <h3
          className="text-xl font-serif mb-3 group-hover:text-[#a51c30] transition-colors"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        <Link
          to={link}
          className="inline-flex items-center text-[#a51c30] hover:text-[#2a1b15] transition-colors font-medium"
        >
          Read More <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

const BlogList = () => {
  const [blogs, setBlogs] = useState<BlogPostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(backendUrl + "/api/blog/list");
        if (!res.ok) {
          setError("Failed to load blogs (server error)");
          setLoading(false);
          return;
        }
        const data: { success: boolean; blogs: Blog[]; message?: string } =
          await res.json();
        if (data.success) {
          setBlogs(
            data.blogs.map((b) => ({
              title: b.title,
              excerpt: b.excerpt,
              imageUrl: b.image,
              date: new Date(b.date).toLocaleDateString(),
              author: b.author,
              link: `/blog/${b.slug}`,
              category: b.category,
            }))
          );
        } else {
          setError(data.message || "Failed to load blogs");
        }
      } catch (err) {
        setError(
          "Could not connect to blog API. Check your backend URL and CORS."
        );
      }
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    const q = debouncedSearch.toLowerCase();
    return (
      blog.title.toLowerCase().includes(q) ||
      blog.excerpt.toLowerCase().includes(q) ||
      blog.author.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#f3ece2]">
      <SEO
        title="Fashion Blog - Style Guides & Insights"
        description="Explore Revive Wardrobe's fashion blog. Get style guides, fashion insights, and behind-the-scenes glimpses into our world of elegance."
        keywords="fashion blog, style guide, fashion tips, clothing trends, fashion insights, wardrobe ideas, buy clothes online dubai, online fashion store uae, dubai clothing store, modest fashion dubai, shein dubai uae online, online clothes shopping uae, abaya online uae, zara uae online, shein online shopping dubai, matalan uae online, order clothes online dubai, best abaya shops in Dubai, Dubai abaya online worldwide shipping, abaya shop Dubai online, luxury abaya Dubai online"
        canonical="/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Revive Wardrobe Blog",
          itemListElement: filteredBlogs.map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `https://revivewardrobe.com${post.link}`,
          })),
        }}
      />
      <Navbar />
      <div className="pb-16">
        <div className="container mx-auto px-4 pt-10 md:pt-14">
          <div className="bg-[#f8f2e9] border border-[#7b4d2e]/20 rounded-2xl p-4 md:p-8 shadow-[0_20px_45px_rgba(41,25,16,0.08)]">
            <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-[#7b4d2e]/15">
              <p className="text-base md:text-lg font-semibold text-[#2a1b15]">Revive Stories</p>
              <p className="text-xs tracking-[0.2em] uppercase text-[#7b4d2e]/80">Innovation Meets Elegance</p>
              <div className="ml-auto w-full md:w-64 relative">
                <input
                  type="text"
                  placeholder="Find story..."
                  className="w-full border border-[#7b4d2e]/20 bg-white rounded-full py-2.5 px-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#a51c30]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7b4d2e]/60" />
              </div>
            </div>

            <div className="grid lg:grid-cols-[0.9fr_1.1fr_0.9fr] gap-6 mt-6 items-end">
              <div className="hidden md:block">
                <div className="rounded-2xl overflow-hidden h-[460px] bg-[#f2d8d6]">
                  <img
                    src={blogs[0]?.imageUrl || "/logo_pc.png"}
                    alt={blogs[0]?.title || "Blog feature"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="px-1 md:px-4">
                <p className="text-xs tracking-[0.2em] uppercase text-[#7b4d2e]">Trending Editorial</p>
                <h1 className="mt-3 text-4xl md:text-6xl leading-[0.9] font-serif text-[#2a1b15]">
                  Where luxury styling meets modest confidence
                </h1>
                <p className="mt-4 text-[#5e463a] max-w-lg">
                  Curated reads for fabrics, cuts, festive dressing and timeless abaya layering in Dubai.
                </p>
                <Link
                  to={filteredBlogs[0]?.link || "/blog"}
                  className="inline-flex mt-6 items-center gap-2 rounded-full border border-[#a51c30] text-[#a51c30] px-5 py-2.5 hover:bg-[#a51c30] hover:text-white transition-colors"
                >
                  Read Post <ArrowRight size={16} />
                </Link>
              </div>

              <div>
                <div className="rounded-2xl overflow-hidden h-[360px] md:h-[430px] bg-[#f1dfce] border border-[#7b4d2e]/15">
                  <img
                    src={blogs[1]?.imageUrl || blogs[0]?.imageUrl || "/logo_pc.png"}
                    alt={blogs[1]?.title || "Featured style story"}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-10">
          {/* Blog Posts Grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading blogs...
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No blogs found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((post, index) => (
                <BlogPost key={post.link} {...post} priority={index === 0} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogList;
