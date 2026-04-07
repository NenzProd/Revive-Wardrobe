import type { Product } from "../types/product";
import { getProductCategoryBadges } from "../lib/category";

interface ProductCategoryBadgesProps {
  product: Pick<Product, "category" | "sub_category">;
  align?: "left" | "center";
  className?: string;
}

const ProductCategoryBadges = ({
  product,
  align = "left",
  className = "",
}: ProductCategoryBadgesProps) => {
  const badges = getProductCategoryBadges(product);

  if (badges.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex flex-wrap gap-2 ${align === "center" ? "justify-center" : "justify-start"} ${className}`.trim()}
    >
      {badges.map((badge) => (
        <span
          key={`${badge.kind}-${badge.label}`}
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide ${badge.className}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
};

export default ProductCategoryBadges;
