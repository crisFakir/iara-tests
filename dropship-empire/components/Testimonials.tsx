'use client'

import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const testimonials = [
  {
    name: 'Maria Silva',
    avatar: 'MS',
    rating: 5,
    comment: 'O smartwatch é incrível! Chegou em 3 dias e a qualidade superou minhas expectativas. Recomendo!',
    product: 'SmartWatch Ultra Pro',
    verified: true
  },
  {
    name: 'João Santos',
    avatar: 'JS',
    rating: 5,
    comment: 'Comprei o corretor postural e mudou minha vida! Acabaram as dores nas costas. Produto top!',
    product: 'Posture Corrector Pro',
    verified: true
  },
  {
    name: 'Ana Costa',
    avatar: 'AC',
    rating: 5,
    comment: 'Os earbuds são melhores que os AirPods! Som perfeito e bateria dura mesmo 48h. Vale cada cêntimo!',
    product: 'EarPods Pro',
    verified: true
  }
]

export default function Testimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            O Que Dizem os <span className="text-blue-600">Nossos Clientes</span>
          </h2>
          <p className="text-lg text-gray-600">
            Mais de 10.000 clientes satisfeitos em toda a Europa
          </p>
        </div>

        {/* Testimonials Grid */}
        <div ref={ref} className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-100" />
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-6 italic">"{testimonial.comment}"</p>

              {/* Product */}
              <p className="text-sm text-blue-600 font-semibold mb-4">
                Comprou: {testimonial.product}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  {testimonial.verified && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      ✓ Compra Verificada
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-full">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-semibold">4.9/5 baseado em 2.847+ avaliações</span>
          </div>
        </div>
      </div>
    </section>
  )
}