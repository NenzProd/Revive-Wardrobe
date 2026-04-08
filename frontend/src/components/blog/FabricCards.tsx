import type { FC } from "react";
import type { FabricCardItem } from "./types";

interface FabricCardsProps {
  items?: FabricCardItem[];
}

const FabricCards: FC<FabricCardsProps> = ({ items = [] }) => (
  <section className="py-16">
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <div key={`${item.name || "fabric"}-${index}`} className="border border-[#7b4d2e]/15 bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
          {item.image ? <img src={item.image} alt={item.name || "Fabric"} className="h-60 w-full object-cover" /> : null}
          <div className="p-4">
            {item.name ? <h3 className="text-xl font-semibold mb-2">{item.name}</h3> : null}
            <ul className="text-sm text-gray-600 space-y-1">
              {(item.points || []).map((point, idx) => (
                <li key={`${index}-${idx}`}>• {point}</li>
              ))}
            </ul>
            {item.bestFor ? <p className="mt-3 text-xs text-gray-500">Best for: {item.bestFor}</p> : null}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default FabricCards;
