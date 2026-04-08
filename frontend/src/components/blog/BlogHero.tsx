import type { FC } from "react";

interface BlogHeroProps {
  title: string;
  author: string;
  readTime: string;
  coverImage: string;
}

const BlogHero: FC<BlogHeroProps> = ({ title, author, readTime, coverImage }) => {
  return (
    <section className="relative h-[68vh] min-h-[420px] rounded-2xl overflow-hidden border border-[#7b4d2e]/15 shadow-[0_20px_45px_rgba(0,0,0,0.1)]">
      <img src={coverImage} alt={title} className="w-full h-full object-cover object-top" />
      <div className="absolute inset-0 bg-black/45 flex items-center justify-center px-6">
        <div className="text-center text-white max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-serif mb-4">{title}</h1>
          <p className="text-sm md:text-base opacity-90">
            {author} • {readTime}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
