export interface ProductVariant {
  sku: string
  barcode: string
  retail_price: number
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
  bestseller: boolean
  type: 'Stitched' | 'Unstitched'
  currency?: string
  country?: string
  filter_name?: string
  variants: ProductVariant[]
  date?: string
  __v?: number
}

export interface CartItem extends Omit<Product, 'id'> {
  _id: string
  quantity: number
  selectedSize?: string
  selectedColor?: string
}
