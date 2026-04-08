import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Calendar, User, ArrowLeft, Share2, Clock } from "lucide-react";
import SEO from "../components/SEO";
import { backendUrl } from "../config/constants";
import { PRIMARY_BUTTON_CLASS, SECONDARY_BUTTON_CLASS } from "@/lib/buttonStyles";
import BlogHero from "@/components/blog/BlogHero";
import StorySectionRenderer from "@/components/blog/StorySectionRenderer";
import RelatedBlogs from "@/components/blog/RelatedBlogs";
import type { StorySection } from "@/components/blog/types";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  slug: string;
  readTime: string;
  category: string;
  sections?: StorySection[];
}

interface BlogPostContent {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
  dateISO: string;
  author: string;
  readTime: string;
  category: string;
  sections: StorySection[];
}

interface BlogComment {
  _id: string;
  name: string;
  comment: string;
  date: string;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentForm, setCommentForm] = useState({ name: "", email: "", comment: "" });

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const linkify = (text: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentNode as HTMLElement;
        if (!parent || ["A", "SCRIPT", "STYLE"].includes(parent.tagName)) return;

        const content = node.textContent || "";
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        if (!urlRegex.test(content)) return;

        const parts = content.split(urlRegex);
        if (parts.length <= 1) return;

        const fragment = document.createDocumentFragment();
        parts.forEach((part, i) => {
          if (i % 2 === 1) {
            const a = document.createElement("a");
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
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        (node as Element).childNodes.forEach((child) => walk(child));
      }
    };

    doc.body.childNodes.forEach((child) => walk(child));
    return doc.body.innerHTML;
  };

  useEffect(() => {
    async function fetchBlog() {
      if (!slug) {
        setError("Blog post not found");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const res = await fetch(backendUrl + `/api/blog/slug/${encodeURIComponent(slug)}`);
        if (!res.ok) {
          setError("Failed to load blog (server error)");
          setLoading(false);
          return;
        }

        const data: { success: boolean; blog?: Blog; message?: string } = await res.json();
        if (!data.success || !data.blog) {
          setError(data.message || "Blog post not found");
          setLoading(false);
          return;
        }

        const found = data.blog;
        const publishedISO = new Date(found.date).toISOString();
        setPost({
          id: found._id,
          title: found.title,
          excerpt: found.excerpt,
          content: linkify(decodeHtml(found.content || "")),
          imageUrl: found.image,
          date: new Date(found.date).toLocaleDateString(),
          dateISO: publishedISO,
          author: found.author,
          readTime: found.readTime,
          category: found.category,
          sections: Array.isArray(found.sections) ? found.sections : [],
        });
      } catch {
        setError("Could not connect to blog API. Check your backend URL and CORS.");
      }
      setLoading(false);
    }

    fetchBlog();
  }, [slug]);

  useEffect(() => {
    async function fetchComments() {
      if (!slug) return;
      try {
        const res = await fetch(backendUrl + `/api/blog/comments/${encodeURIComponent(slug)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) setComments(data.comments || []);
      } catch {}
    }
    fetchComments();
  }, [slug]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {}
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!slug) return;

    const payload = {
      slug,
      name: commentForm.name.trim(),
      email: commentForm.email.trim(),
      comment: commentForm.comment.trim(),
    };

    if (!payload.name || !payload.email || !payload.comment) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(backendUrl + "/api/blog/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) setCommentForm({ name: "", email: "", comment: "" });
    } catch {
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading blog...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center text-gray-500">Blog post not found</div>;

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      <SEO
        title={`${post.title.replace(/<[^>]*>?/gm, "")} - Blog`}
        description={post.excerpt}
        keywords={`${post.category}, fashion blog, style guide, ${post.title.replace(/<[^>]*>?/gm, "")}`}
        canonical={`/blog/${slug}`}
        ogImage={post.imageUrl}
        ogType="article"
      />
      <Navbar />
      <div className="pt-20 md:pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link to="/blog" className="inline-flex items-center text-[#5e463a] hover:text-revive-red transition-colors">
              <ArrowLeft size={18} className="mr-2" /> Back to Blog
            </Link>
          </div>

          <div className="max-w-3xl mx-auto mb-8 rounded-2xl border border-[#7b4d2e]/10 bg-white p-6 md:p-8 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
            <h1 className="text-2xl md:text-4xl font-serif mb-6" dangerouslySetInnerHTML={{ __html: post.title }} />
            <div className="flex flex-wrap items-center text-gray-500 gap-4">
              <div className="flex items-center"><Calendar size={16} className="mr-2" />{post.date}</div>
              <div className="flex items-center"><User size={16} className="mr-2" />{post.author}</div>
              <div className="flex items-center"><Clock size={16} className="mr-2" />{post.readTime}</div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mb-10">
            <BlogHero
              title={post.title.replace(/<[^>]*>?/gm, "")}
              author={post.author}
              readTime={post.readTime}
              coverImage={post.imageUrl}
            />
          </div>

          <div className="max-w-6xl mx-auto rounded-2xl border border-[#7b4d2e]/10 bg-white p-6 md:p-10 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
            {post.sections.length > 0 ? (
              <StorySectionRenderer sections={post.sections} />
            ) : (
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            )}

            <RelatedBlogs />

            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center">
                <span className="text-gray-600 mr-4">Share this article:</span>
                <div className="flex items-center space-x-4">
                  <button onClick={handleShare} className={`${SECONDARY_BUTTON_CLASS} transition-colors flex items-center rounded-md px-3 py-2`} title="Copy link to clipboard">
                    <Share2 size={18} />
                  </button>
                  {copySuccess && <span className="text-green-600 text-sm">Link copied to clipboard!</span>}
                </div>
              </div>
            </div>

            <div className="mt-12 border-t pt-8">
              <h2 className="text-2xl font-serif mb-6">Comments</h2>
              <form onSubmit={handleCommentSubmit} className="space-y-3 mb-8">
                <div className="grid md:grid-cols-2 gap-3">
                  <input type="text" placeholder="Your name" value={commentForm.name} onChange={(e) => setCommentForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2" required />
                  <input type="email" placeholder="Your email" value={commentForm.email} onChange={(e) => setCommentForm((prev) => ({ ...prev, email: e.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2" required />
                </div>
                <textarea placeholder="Write your comment" value={commentForm.comment} onChange={(e) => setCommentForm((prev) => ({ ...prev, comment: e.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2 min-h-[110px]" required />
                <button type="submit" disabled={isSubmittingComment} className={`rounded px-5 py-2 disabled:opacity-70 ${PRIMARY_BUTTON_CLASS}`}>
                  {isSubmittingComment ? "Submitting..." : "Post Comment"}
                </button>
                <p className="text-xs text-gray-500">Comments are moderated before they appear publicly.</p>
              </form>

              <div className="space-y-4">
                {comments.length === 0 && <p className="text-sm text-gray-500">No approved comments yet.</p>}
                {comments.map((comment) => (
                  <div key={comment._id} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-800">{comment.name}</p>
                      <p className="text-xs text-gray-500">{new Date(comment.date).toLocaleDateString()}</p>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetail;
