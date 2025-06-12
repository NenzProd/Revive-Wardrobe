export interface Product {
  _id?: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  description: string;
  fabric: string;
  image: string[];
  category: string;
  bestseller: boolean;
  type: 'Stitched' | 'Unstitched';
  stock?: number;
  sizes?: string[];
  date?: string;
  createdAt?: string;
}

export interface CartItem extends Omit<Product, 'id'> {
  _id: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}
