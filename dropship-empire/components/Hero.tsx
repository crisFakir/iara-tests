'use client'

import { ArrowRight, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">+5.000 vendas este mês</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Gadgets que <span className="text-blue-600">Transformam</span> o Seu Dia
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Descubra produtos inovadores com até <span className="font-bold text-red-500">70% OFF</span>. 
              Entrega grátis em pedidos acima de 50€. Stock limitado!
            </p>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 ml-2">4.9/5 (2.847 avaliações)</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Ver Produtos
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition shadow-lg"
              >
                <span className="relative">
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                    -70%
                  </span>
                  Promoções
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image/Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
                alt="Produtos em destaque"
                className="w-full h-full object-cover"
              />
              
              {/* Floating badges */}
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold animate-bounce">
                OFERTA LIMITADA
              </div>
              
              <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm text-gray-600">Próximo envio em:</p>
                <p className="text-lg font-bold text-blue-600">2h 34min</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-30 -z-10"></div>
    </section>
  )
}