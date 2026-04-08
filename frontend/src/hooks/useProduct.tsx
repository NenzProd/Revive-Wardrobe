import { useState, useEffect } from 'react'
import axios from 'axios'
import type { Product } from '../types/product'
import { mapProductForUi } from '../lib/product'
import { backendUrl } from '../config/constants'
import { getVisibleCategories } from '@/lib/categoryVisibility'

export function useProductList () {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts () {
      setLoading(true)
      try {
        const productRes = await axios.get(backendUrl + '/api/product/list')
        if (productRes.data.success) {
          const categories = await getVisibleCategories(backendUrl)
          const enabledCategories = categories
            .filter((entry) => entry.enabled)
            .map((entry) => entry.category)
          const rawProducts = productRes.data.products as Product[]
          const filteredProducts = enabledCategories.length > 0
            ? rawProducts.filter((p) => enabledCategories.includes(p.category))
            : rawProducts
          const mapped = filteredProducts.map((p: Product) => mapProductForUi(p))
          setProducts(mapped)
        } else {
          setError(productRes.data.message)
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
        const productRes = await axios.get(backendUrl + '/api/product/list')
        if (productRes.data.success) {
          const categories = await getVisibleCategories(backendUrl)
          const enabledCategories = categories
            .filter((entry) => entry.enabled)
            .map((entry) => entry.category)
          const visibleProducts: Product[] = enabledCategories.length > 0
            ? productRes.data.products.filter((p: Product) => enabledCategories.includes(p.category))
            : productRes.data.products
          const found: Product | undefined = visibleProducts.find((p: Product) => p.slug === slug)
          if (found) {
            setProduct(mapProductForUi(found))
          } else {
            setProduct(null)
          }
        } else {
          setError(productRes.data.message)
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
