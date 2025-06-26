import { useState, useEffect } from 'react'
import axios from 'axios'
import type { Product } from '../types/product'

const backendUrl = import.meta.env.VITE_BACKEND_URL

export function useProductList () {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts () {
      setLoading(true)
      try {
        const res = await axios.get(backendUrl + '/api/product/list')
        if (res.data.success) {
          // Map products to add price/salePrice from first variant for UI compatibility
          const mapped = res.data.products.map((p: Product) => {
            const firstVariant = p.variants && p.variants[0]
            return {
              ...p,
              price: firstVariant ? firstVariant.retail_price : undefined,
              salePrice: firstVariant && firstVariant.discount > 0 ? firstVariant.retail_price - firstVariant.discount : undefined,
              sizes: p.variants ? Array.from(new Set(p.variants.flatMap(v => v.filter_value))) : []
            }
          })
          setProducts(mapped)
        } else {
          setError(res.data.message)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return { products, loading, error }
}

export function useProductBySlug (slug: string) {
  const [product, setProduct] = useState<Product & { price?: number, salePrice?: number, sizes?: string[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct () {
      setLoading(true)
      try {
        const res = await axios.get(backendUrl + '/api/product/list')
        if (res.data.success) {
          const found: Product | undefined = res.data.products.find((p: Product) => p.slug === slug)
          if (found) {
            const firstVariant = found.variants && found.variants[0]
            setProduct({
              ...found,
              price: firstVariant ? firstVariant.retail_price : undefined,
              salePrice: firstVariant && firstVariant.discount > 0 ? firstVariant.retail_price - firstVariant.discount : undefined,
              sizes: found.variants ? Array.from(new Set(found.variants.flatMap(v => v.filter_value))) : []
            })
          } else {
            setProduct(null)
          }
        } else {
          setError(res.data.message)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchProduct()
  }, [slug])

  return { product, loading, error }
}
