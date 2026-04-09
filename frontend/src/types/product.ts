export interface ProductVariant {
  sku: string
  barcode: string
  retail_price: number
  offer_price?: number
  discount: number
  weight_unit: string
  filter_value: string
  min_order_quantity: number
  stock: number
  _id?: string
}

export interface Product {
  _id?: string
  name: string
  slug: string
  description: string
  image: string[]
  category: string
  sub_category?: string
  bestseller: boolean
  type: 'Stitched' | 'Unstitched'
  currency?: string
  country?: string
  filter_name?: string
  variants: ProductVariant[]
  date?: string
  __v?: number
  price?: number
  salePrice?: number
  isSale?: boolean
  sizes?: string[]
  colors?: string[]
  popularity?: number
  createdAt?: string
}

export interface CartItem extends Omit<Product, 'id'> {
  _id: string
  quantity: number
  selectedSize?: string
  selectedColor?: string
}
