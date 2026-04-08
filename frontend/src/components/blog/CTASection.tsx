import type { FC } from "react";
import { Link } from "react-router-dom";
import { PRIMARY_BUTTON_CLASS } from "@/lib/buttonStyles";

interface CTASectionProps {
  heading?: string;
  content?: string;
  button?: string;
  buttonLink?: string;
}

const CTASection: FC<CTASectionProps> = ({ heading, content, button = "Shop Now", buttonLink = "/shop/category/graceful-abayas" }) => (
  <section className="py-16">
    <div className="max-w-4xl mx-auto rounded-2xl bg-[#2a1b15] text-white p-8 md:p-12 text-center border border-[#7b4d2e]/20">
      {heading ? <h3 className="text-3xl font-serif mb-3">{heading}</h3> : null}
      {content ? <p className="text-white/85 mb-6">{content}</p> : null}
      <Link to={buttonLink} className={`${PRIMARY_BUTTON_CLASS} inline-flex items-center justify-center px-6 py-3 rounded-md`}>
        {button}
      </Link>
    </div>
  </section>
);

export default CTASection;
