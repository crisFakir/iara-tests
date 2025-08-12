'use client'

import { Star, ShoppingCart, Flame } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    description: string
    price: number
    comparePrice: number
    images: string
    rating: number
    reviews: number
    bestseller: boolean
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const images = JSON.parse(product.images)
  const discount = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0]
    })
    toast.success(`${product.name} adicionado ao carrinho!`)
  }

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Badges */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          -{discount}%
        </div>
      )}
      {product.bestseller && (
        <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Flame className="w-3 h-3" />
          HOT
        </div>
      )}

      {/* Image */}
      <Link href={`/product/${product.slug}`}>
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">{product.price}€</span>
          {product.comparePrice > product.price && (
            <span className="text-sm text-gray-500 line-through">{product.comparePrice}€</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 group"
        >
          <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition" />
          Adicionar ao Carrinho
        </button>

        {/* Urgency */}
        <p className="text-xs text-gray-600 mt-2 text-center">
          🔥 Apenas {Math.floor(Math.random() * 10) + 3} em stock!
        </p>
      </div>
    </div>
  )
}