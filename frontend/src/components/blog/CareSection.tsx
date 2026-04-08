import type { FC } from "react";

interface CareSectionProps {
  title?: string;
  items?: string[];
}

const CareSection: FC<CareSectionProps> = ({ title = "Care Guide", items = [] }) => (
  <section className="py-16 bg-[#f8f2e9] rounded-2xl border border-[#7b4d2e]/10">
    <div className="max-w-4xl mx-auto">
      <h3 className="text-2xl font-serif mb-5 text-[#2a1b15]">{title}</h3>
      <ul className="space-y-2 text-[#5e463a]">
        {items.map((item, idx) => (
          <li key={`${item}-${idx}`}>• {item}</li>
        ))}
      </ul>
    </div>
  </section>
);

export default CareSection;
