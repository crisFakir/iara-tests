'use client'

import { ShoppingCart, Menu, X, Star, Shield, Truck } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useCartStore } from '@/lib/store'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <>
      {/* Trust Bar */}
      <div className="bg-black text-white text-xs py-2">
        <div className="container mx-auto px-4 flex justify-center items-center gap-6 flex-wrap">
          <span className="flex items-center gap-1">
            <Truck className="w-3 h-3" />
            Envio Grátis acima de 50€
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Pagamento 100% Seguro
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            +10.000 Clientes Satisfeitos
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Tech<span className="text-blue-600">Trend</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/products" className="text-gray-700 hover:text-blue-600 transition">
                Produtos
              </Link>
              <Link href="/bestsellers" className="text-gray-700 hover:text-blue-600 transition">
                Mais Vendidos
              </Link>
              <Link href="/deals" className="text-gray-700 hover:text-blue-600 transition">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-1">HOT</span>
                Promoções
              </Link>
              <Link href="/track" className="text-gray-700 hover:text-blue-600 transition">
                Rastrear Pedido
              </Link>
            </div>

            {/* Cart & Mobile Menu */}
            <div className="flex items-center gap-4">
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t">
              <div className="flex flex-col gap-3">
                <Link href="/products" className="text-gray-700 hover:text-blue-600 transition">
                  Produtos
                </Link>
                <Link href="/bestsellers" className="text-gray-700 hover:text-blue-600 transition">
                  Mais Vendidos
                </Link>
                <Link href="/deals" className="text-gray-700 hover:text-blue-600 transition">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-1">HOT</span>
                  Promoções
                </Link>
                <Link href="/track" className="text-gray-700 hover:text-blue-600 transition">
                  Rastrear Pedido
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}