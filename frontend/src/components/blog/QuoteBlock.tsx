import type { FC } from "react";

interface QuoteBlockProps {
  text?: string;
}

const QuoteBlock: FC<QuoteBlockProps> = ({ text }) => (
  <section className="py-20 bg-[#f4ede4] rounded-2xl border border-[#7b4d2e]/10">
    <p className="text-2xl font-serif max-w-3xl mx-auto text-center text-[#2a1b15]">“{text || ""}”</p>
  </section>
);

export default QuoteBlock;
