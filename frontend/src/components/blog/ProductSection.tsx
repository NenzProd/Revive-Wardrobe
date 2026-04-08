import type { FC } from "react";
import type { ProductItem } from "./types";

interface ProductSectionProps {
  title?: string;
  items?: ProductItem[];
}

const ProductSection: FC<ProductSectionProps> = ({ title = "Featured Products", items = [] }) => (
  <section className="py-16">
    <div className="max-w-6xl mx-auto">
      <h3 className="text-2xl font-serif mb-6 text-[#2a1b15]">{title}</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div key={`${item.name || "product"}-${idx}`} className="bg-white rounded-xl border border-[#7b4d2e]/15 overflow-hidden">
            {item.image ? <img src={item.image} alt={item.name || "Product"} className="h-56 w-full object-cover" /> : null}
            <div className="p-4">
              <p className="font-semibold text-[#2a1b15]">{item.name}</p>
              <p className="text-sm text-[#a51c30] mt-1">{item.price}</p>
              {item.link ? (
                <a href={item.link} className="inline-block mt-3 text-sm text-[#6d4a35] hover:text-[#a51c30]">
                  View Product
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductSection;
