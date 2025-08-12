'use client'

import { useCartStore } from '@/lib/store'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Lock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const [isCheckout, setIsCheckout] = useState(false)
  const [loading, setLoading] = useState(false)
  const [upsellAccepted, setUpsellAccepted] = useState(false)
  
  const subtotal = getTotalPrice()
  const shipping = subtotal > 50 ? 0 : 4.99
  const discount = upsellAccepted ? subtotal * 0.1 : 0
  const total = subtotal + shipping - discount

  // Upsell product
  const upsellProduct = {
    id: 'upsell-1',
    name: 'Protetor de Ecrã Premium',
    price: 9.99,
    originalPrice: 19.99,
    description: 'Proteja seu novo gadget com nosso protetor premium!'
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Carrinho vazio!')
      return
    }

    setLoading(true)
    
    // Simulate checkout process
    setTimeout(() => {
      toast.success('Pedido processado com sucesso!')
      clearCart()
      setLoading(false)
      // Redirect to success page
      window.location.href = '/success'
    }, 2000)
  }

  if (items.length === 0 && !isCheckout) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Carrinho Vazio</h1>
            <p className="text-gray-600 mb-8">Adicione produtos incríveis ao seu carrinho!</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isCheckout ? 'Finalizar Compra' : 'Seu Carrinho'}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Checkout 100% seguro com encriptação SSL</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                {/* Urgency Banner */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
                  <div className="flex items-center gap-2 text-orange-700">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">Alta procura!</span>
                    <span className="text-sm">Complete sua compra nos próximos 10 minutos</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">Em stock - Envio em 24h</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border hover:bg-gray-100 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border hover:bg-gray-100 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">{(item.price * item.quantity).toFixed(2)}€</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 mt-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upsell */}
                {!upsellAccepted && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="upsell"
                        checked={upsellAccepted}
                        onChange={(e) => setUpsellAccepted(e.target.checked)}
                        className="mt-1"
                      />
                      <label htmlFor="upsell" className="flex-1 cursor-pointer">
                        <div className="font-semibold text-gray-900">
                          🎁 Oferta Especial: {upsellProduct.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {upsellProduct.description}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold text-blue-600">{upsellProduct.price}€</span>
                          <span className="text-sm text-gray-500 line-through">{upsellProduct.originalPrice}€</span>
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Poupa 50% + 10% desconto extra!
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)}€</span>
                  </div>
                  {upsellAccepted && (
                    <>
                      <div className="flex justify-between text-gray-600">
                        <span>{upsellProduct.name}</span>
                        <span>{upsellProduct.price}€</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Desconto (10%)</span>
                        <span>-{discount.toFixed(2)}€</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Envio</span>
                    <span>{shipping === 0 ? 'GRÁTIS' : `${shipping.toFixed(2)}€`}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>{total.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>

                {/* Discount Code */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Código de desconto"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processando...' : 'Finalizar Compra Segura'}
                </button>

                {/* Trust Badges */}
                <div className="mt-6 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Pagamento 100% seguro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>30 dias de garantia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Envio rastreável</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}