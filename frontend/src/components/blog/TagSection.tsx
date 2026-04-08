import type { FC } from "react";

interface TagSectionProps {
  title?: string;
  items?: string[];
}

const TagSection: FC<TagSectionProps> = ({ title, items = [] }) => (
  <section className="py-16">
    <div className="max-w-4xl mx-auto">
      {title ? <h3 className="text-2xl font-serif mb-5 text-[#2a1b15]">{title}</h3> : null}
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <span key={`${item}-${idx}`} className="rounded-full border border-[#7b4d2e]/20 bg-[#f6eee3] px-4 py-2 text-sm text-[#6d4a35]">
            {item}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default TagSection;
