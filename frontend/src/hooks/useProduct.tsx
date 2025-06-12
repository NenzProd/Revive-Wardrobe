import { useState, useEffect } from 'react'
import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL

export function useProductList () {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProducts () {
      setLoading(true)
      try {
        const res = await axios.get(backendUrl + '/api/product/list')
        if (res.data.success) {
          setProducts(res.data.products)
        } else {
          setError(res.data.message)
        }
      } catch (err) {
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
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProduct () {
      setLoading(true)
      try {
        // First, fetch all products and find by slug
        const res = await axios.get(backendUrl + '/api/product/list')
        if (res.data.success) {
          const found = res.data.products.find((p: any) => p.slug === slug)
          setProduct(found || null)
        } else {
          setError(res.data.message)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchProduct()
  }, [slug])

  return { product, loading, error }
}
