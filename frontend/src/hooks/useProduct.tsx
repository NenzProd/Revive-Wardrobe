import { useState, useEffect } from 'react'
import axios from 'axios'
import type { Product } from '../types/product'
import { mapProductForUi } from '../lib/product'
import { backendUrl } from '../config/constants'

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
          const mapped = res.data.products.map((p: Product) => mapProductForUi(p))
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
            setProduct(mapProductForUi(found))
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
