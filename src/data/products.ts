import { ZainabChottani, CrimsonLawn, CrimsonLuxury, CHARIZMAAGHAZE, SilkSleepwear, BridalCollection } from '../assets/assets.js'

export interface Product {
  id: number
  name: string
  price: number
  imageUrl: string
  images: string[]
  isNew?: boolean
  isSale?: boolean
  slug: string
  featured?: boolean
  description: string
  isStitched: boolean
  salePrice?: number
  material: string
  careInstructions: string[]
  deliveryEstimate: string
  sizes?: string[]
  categories: string[]
  tags: string[]
  popularity?: number
}

export const products: Product[] = [
  {
    id: 1,
    name: "Zainab Chottani – Lawn Suit",
    price: 3400,
    imageUrl: ZainabChottani,
    images: [ZainabChottani, CrimsonLawn, CrimsonLuxury],
    isNew: true,
    slug: 'zainab-chottani-lawn-suit',
    featured: true,
    description: 'Elegant lawn suit with intricate embroidery. Perfect for special occasions and formal gatherings.',
    isStitched: true,
    material: 'Premium lawn fabric with chiffon dupatta',
    careInstructions: [
      'Hand wash with mild detergent',
      'Do not bleach',
      'Iron on medium heat',
      'Dry in shade'
    ],
    deliveryEstimate: '3-5 business days',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    categories: ['fabric-lawn', 'type-stitched'],
    tags: ['summer', 'casual', 'lawn'],
    popularity: 85
  },
  {
    id: 2,
    name: "Crimson – Lawn Cotton Suit",
    price: 7999.00,
    imageUrl: CrimsonLawn,
    images: [CrimsonLawn, ZainabChottani, CrimsonLuxury],
    slug: 'crimson-lawn-cotton-suit',
    featured: true,
    description: 'Premium cotton lawn suit with modern design. Features intricate embroidery and comfortable fit.',
    isStitched: true,
    material: 'Cotton lawn with organza dupatta',
    careInstructions: [
      'Gentle machine wash in cold water',
      'Dry clean recommended for dupatta',
      'Iron on medium heat',
      'Store in a cool, dry place'
    ],
    deliveryEstimate: '4-6 business days',
    sizes: ['S', 'M', 'L', 'XL'],
    categories: ['fabric-cotton', 'type-stitched'],
    tags: ['embroidered', 'formal', 'cotton'],
    popularity: 75
  },
  {
    id: 3,
    name: "Crimson Luxury – Full Embroidered Lawn",
    price: 12999.00,
    imageUrl: CrimsonLuxury,
    images: [CrimsonLuxury, CHARIZMAAGHAZE, SilkSleepwear],
    slug: 'crimson-luxury-full-embroidered-lawn',
    featured: true,
    description: 'Luxurious embroidered lawn collection. Perfect for special occasions with premium quality fabric.',
    isStitched: true,
    material: 'Embroidered lawn with organza dupatta',
    careInstructions: [
      'Dry clean only',
      'Store hanging to avoid creasing',
      'Keep away from direct sunlight'
    ],
    deliveryEstimate: '5-7 business days',
    sizes: ['S', 'M', 'L'],
    categories: ['fabric-lawn', 'type-stitched'],
    tags: ['luxury', 'embroidered', 'formal'],
    popularity: 90
  },
  {
    id: 4,
    name: "CHARIZMA AGHAZE NOU",
    price: 10999.00,
    imageUrl: CHARIZMAAGHAZE,
    images: [CHARIZMAAGHAZE, BridalCollection, CrimsonLuxury],
    isSale: true,
    salePrice: 8999.00,
    slug: 'charizma-aghaze-nou',
    featured: true,
    description: 'Exclusive collection with premium fabric. Features intricate embroidery and modern design.',
    isStitched: true,
    material: 'Premium silk blend with custom embroidery',
    careInstructions: [
      'Dry clean only',
      'Steam to remove wrinkles',
      'Store in garment bag'
    ],
    deliveryEstimate: '3-5 business days',
    sizes: ['S', 'M', 'L'],
    categories: ['fabric-silk', 'type-stitched'],
    tags: ['luxury', 'formal', 'party'],
    popularity: 95
  },
  {
    id: 5,
    name: "Zainab Chottani - Unstitched",
    price: 3400.00,
    imageUrl: SilkSleepwear,
    images: [SilkSleepwear, ZainabChottani, CrimsonLawn],
    slug: 'zainab-chottani-unstitched',
    featured: true,
    description: 'Unstitched fabric collection. Premium quality fabric ready for custom tailoring.',
    isStitched: false,
    material: 'Premium lawn fabric',
    careInstructions: [
      'Hand wash with mild detergent',
      'Do not bleach',
      'Iron on medium heat',
      'Dry in shade'
    ],
    deliveryEstimate: '3-5 business days',
    categories: ['fabric-lawn', 'type-unstitched'],
    tags: ['unstitched', 'fabric', 'custom'],
    popularity: 80
  },
  {
    id: 6,
    name: "Crimson Luxury - Unstitched",
    price: 12999.00,
    imageUrl: BridalCollection,
    images: [BridalCollection, CrimsonLuxury, CHARIZMAAGHAZE],
    isNew: true,
    slug: 'crimson-luxury-unstitched',
    featured: true,
    description: 'Premium unstitched collection. Luxury fabric perfect for custom tailoring.',
    isStitched: false,
    material: 'Premium silk with hand embroidery',
    careInstructions: [
      'Professional dry clean only',
      'Store in cool, dry place',
      'Handle with care to preserve embellishments'
    ],
    deliveryEstimate: '5-7 business days',
    categories: ['fabric-silk', 'type-unstitched'],
    tags: ['luxury', 'unstitched', 'custom'],
    popularity: 88
  }
]

// Get all products
export const getAllProducts = (): Product[] => {
  return products
}

// Get product by ID
export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id)
}

// Get product by slug
export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug)
}

// Get featured products
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured)
}

// Get related products
export const getRelatedProducts = (productId: number): Product[] => {
  const currentProduct = getProductById(productId)
  
  if (!currentProduct) {
    return []
  }
  
  return products
    .filter(product => 
      product.id !== productId && (
        product.categories.some(cat => currentProduct.categories.includes(cat)) ||
        product.tags.some(tag => currentProduct.tags.includes(tag))
      )
    )
    .slice(0, 4)
}
