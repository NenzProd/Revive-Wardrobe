import type { FC } from "react";

interface SplitSectionProps {
  title?: string;
  image?: string;
  content?: string;
}

const SplitSection: FC<SplitSectionProps> = ({ title, image, content }) => (
  <section className="py-16">
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
      <div>
        {title ? <h3 className="text-2xl font-serif mb-3 text-[#2a1b15]">{title}</h3> : null}
        {content ? <p className="text-[#5e463a] leading-relaxed">{content}</p> : null}
      </div>
      {image ? (
        <div className="rounded-2xl overflow-hidden border border-[#7b4d2e]/15 shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
          <img src={image} alt={title || "Split section"} className="w-full h-[360px] object-cover" />
        </div>
      ) : null}
    </div>
  </section>
);

export default SplitSection;
