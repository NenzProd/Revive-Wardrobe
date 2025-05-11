
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  description: string;
  material: string;
  careInstructions: string[];
  imageUrl: string;
  images: string[];
  categories: string[];
  tags: string[];
  isNew?: boolean;
  isSale?: boolean;
  isStitched: boolean;
  sizes?: string[];
  colors?: string[];
  deliveryEstimate?: string;
  popularity?: number;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}
