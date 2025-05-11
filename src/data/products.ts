
import { Product } from '../types/product';
import {
  ZainabChottani, 
  CrimsonLawn, 
  CrimsonLuxury, 
  CHARIZMAAGHAZE,
  SilkSleepwear,
  BridalCollection,
  GracefulAbayas,
  EthnicElegance,
  IntimateCollection
} from '../assets/assets';

// Mock product data
const products: Product[] = [
  {
    id: 1,
    name: "Zainab Chottani – Lawn Suit with Chiffon Dupatta (Unstitched)",
    slug: "zainab-chottani-lawn-suit",
    price: 3400,
    description: "Breathe elegance into your summer with this lightweight lawn ensemble. Featuring delicate prints and a sheer chiffon dupatta, it's the ideal blend of comfort and charm — ready to be tailored your way.",
    material: "Premium lawn fabric with chiffon dupatta",
    careInstructions: [
      "Hand wash with mild detergent",
      "Do not bleach",
      "Iron on medium heat",
      "Dry in shade"
    ],
    imageUrl: ZainabChottani,
    images: [ZainabChottani, CrimsonLawn, EthnicElegance],
    categories: ["fabric-lawn", "type-unstitched"],
    tags: ["summer", "casual", "lawn"],
    isNew: true,
    isStitched: false,
    deliveryEstimate: "3-5 business days",
    popularity: 85,
    createdAt: "2023-06-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Crimson – Lawn Cotton Suit with Organza Dupatta, Chikankari Work",
    slug: "crimson-lawn-cotton-suit",
    price: 4300,
    description: "Soft cotton meets the finesse of Chikankari embroidery in this versatile 3-piece suit. Paired with an ethereal organza dupatta, it's a celebration of heritage with a modern twist.",
    material: "Cotton lawn with organza dupatta",
    careInstructions: [
      "Gentle machine wash in cold water",
      "Dry clean recommended for dupatta",
      "Iron on medium heat",
      "Store in a cool, dry place"
    ],
    imageUrl: CrimsonLawn,
    images: [CrimsonLawn, ZainabChottani, CrimsonLuxury],
    categories: ["fabric-cotton", "type-unstitched"],
    tags: ["embroidered", "formal", "cotton"],
    isStitched: false,
    sizes: ["XS", "S", "M", "L", "XL"],
    deliveryEstimate: "4-6 business days",
    popularity: 75,
    createdAt: "2023-05-20T10:00:00Z"
  },
  {
    id: 3,
    name: "Crimson Luxury – Full Embroidered Lawn with Organza Dupatta & Cambric Trouser",
    slug: "crimson-luxury-embroidered-lawn",
    price: 5950,
    description: "Luxury woven into every detail. This fully embroidered masterpiece is complemented by a rich organza dupatta and structured cambric bottoms — designed for occasions where you want to make a lasting impression.",
    material: "Embroidered lawn with organza dupatta and cambric trouser",
    careInstructions: [
      "Dry clean only",
      "Store hanging to avoid creasing",
      "Keep away from direct sunlight"
    ],
    imageUrl: CrimsonLuxury,
    images: [CrimsonLuxury, CHARIZMAAGHAZE, SilkSleepwear],
    categories: ["fabric-lawn", "fabric-organza", "type-unstitched"],
    tags: ["luxury", "embroidered", "formal"],
    isStitched: false,
    deliveryEstimate: "5-7 business days",
    popularity: 90,
    createdAt: "2023-07-05T10:00:00Z"
  },
  {
    id: 4,
    name: "CHARIZMA AGHAZE NOU – Luxury Collection",
    slug: "charizma-aghaze-nou-luxury",
    price: 8750,
    salePrice: 7250,
    description: "Artistry that speaks volumes. Intricately crafted for the modern muse, this luxe suit radiates sophistication from neckline to hemline. Own the elegance — now at an exclusive price.",
    material: "Premium silk blend with custom embroidery",
    careInstructions: [
      "Dry clean only",
      "Steam to remove wrinkles",
      "Store in garment bag"
    ],
    imageUrl: CHARIZMAAGHAZE,
    images: [CHARIZMAAGHAZE, BridalCollection, CrimsonLuxury],
    categories: ["fabric-silk", "type-stitched"],
    tags: ["luxury", "formal", "party"],
    isSale: true,
    isStitched: true,
    sizes: ["S", "M", "L"],
    deliveryEstimate: "3-5 business days",
    popularity: 95,
    createdAt: "2023-08-10T10:00:00Z"
  },
  {
    id: 5,
    name: "Silk Sleepwear - Premium Collection",
    slug: "silk-sleepwear-premium",
    price: 3400,
    description: "Indulge in luxury with our premium silk sleepwear collection. Designed for ultimate comfort with elegant detailing for a touch of sophistication.",
    material: "100% Pure Silk",
    careInstructions: [
      "Hand wash with cold water",
      "Do not bleach",
      "Iron on low heat or steam",
      "Hang dry in shade"
    ],
    imageUrl: SilkSleepwear,
    images: [SilkSleepwear, IntimateCollection],
    categories: ["fabric-silk", "type-stitched"],
    tags: ["intimate", "sleepwear", "luxury"],
    isStitched: true,
    sizes: ["S", "M", "L", "XL"],
    deliveryEstimate: "2-4 business days",
    popularity: 80,
    createdAt: "2023-04-25T10:00:00Z"
  },
  {
    id: 6,
    name: "Bridal Collection - Luxury Unstitched",
    slug: "bridal-collection-luxury",
    price: 12999,
    description: "Make your special day unforgettable with our exquisite bridal collection. This luxury unstitched fabric features intricate embroidery and handcrafted embellishments.",
    material: "Premium silk with hand embroidery and crystal work",
    careInstructions: [
      "Professional dry clean only",
      "Store in cool, dry place",
      "Handle with care to preserve embellishments"
    ],
    imageUrl: BridalCollection,
    images: [BridalCollection, CrimsonLuxury, CHARIZMAAGHAZE],
    categories: ["fabric-silk", "type-unstitched"],
    tags: ["bridal", "luxury", "formal"],
    isNew: true,
    isStitched: false,
    deliveryEstimate: "7-10 business days",
    popularity: 98,
    createdAt: "2023-09-01T10:00:00Z"
  },
  {
    id: 7,
    name: "Modest Elegance Abaya",
    slug: "modest-elegance-abaya",
    price: 5500,
    description: "Embrace modest fashion with our elegant abaya design. Featuring subtle embellishments and flowing fabric for a graceful silhouette.",
    material: "Premium nida fabric with light embroidery",
    careInstructions: [
      "Gentle machine wash in cold water",
      "Iron on medium heat",
      "Hang to dry"
    ],
    imageUrl: GracefulAbayas,
    images: [GracefulAbayas, EthnicElegance],
    categories: ["fabric-nida", "type-stitched"],
    tags: ["modest", "abaya", "formal"],
    isStitched: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    deliveryEstimate: "3-5 business days",
    popularity: 85,
    createdAt: "2023-07-15T10:00:00Z"
  },
  {
    id: 8,
    name: "Ethnic Heritage Collection",
    slug: "ethnic-heritage-collection",
    price: 7800,
    description: "A tribute to our rich cultural heritage, this collection features traditional motifs with a contemporary approach. Perfect for special occasions.",
    material: "Hand-woven silk with traditional embroidery",
    careInstructions: [
      "Dry clean recommended",
      "Steam to remove wrinkles",
      "Store folded with tissue paper"
    ],
    imageUrl: EthnicElegance,
    images: [EthnicElegance, ZainabChottani, CrimsonLuxury],
    categories: ["fabric-silk", "type-unstitched"],
    tags: ["ethnic", "traditional", "formal"],
    isStitched: false,
    deliveryEstimate: "5-7 business days",
    popularity: 88,
    createdAt: "2023-08-20T10:00:00Z"
  }
];

// Get all products
export const getAllProducts = (): Product[] => {
  return products;
};

// Get product by ID
export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

// Get product by slug
export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

// Get featured products
export const getFeaturedProducts = (): Product[] => {
  // Return products with high popularity
  return products
    .filter(product => (product.popularity || 0) > 80)
    .slice(0, 6);
};

// Get related products
export const getRelatedProducts = (productId: number): Product[] => {
  const currentProduct = getProductById(productId);
  
  if (!currentProduct) {
    return [];
  }
  
  // Get products with similar categories or tags
  return products
    .filter(product => 
      product.id !== productId && (
        product.categories.some(cat => currentProduct.categories.includes(cat)) ||
        product.tags.some(tag => currentProduct.tags.includes(tag))
      )
    )
    .slice(0, 4);
};
