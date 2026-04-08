import type { FC } from "react";

interface BlogIntroProps {
  heading?: string;
  content?: string;
}

const BlogIntro: FC<BlogIntroProps> = ({ heading, content }) => (
  <section className="py-16">
    <div className="max-w-4xl mx-auto">
      {heading ? <h2 className="text-3xl font-serif mb-4 text-[#2a1b15]">{heading}</h2> : null}
      {content ? <p className="text-lg leading-relaxed text-[#5e463a]">{content}</p> : null}
    </div>
  </section>
);

export default BlogIntro;

