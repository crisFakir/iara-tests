'use client'

import { useState } from 'react'
import { Mail, Gift } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        toast.success('Subscrito com sucesso! Verifique seu email para o cupão.')
        setEmail('')
      } else {
        toast.error('Algo correu mal. Tente novamente.')
      }
    } catch (error) {
      toast.error('Erro ao subscrever. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Gift className="w-8 h-8 text-white" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ganhe 10% de Desconto!
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Subscreva a newsletter e receba um cupão de 10% OFF + ofertas exclusivas
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor email"
                required
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'A subscrever...' : 'Ganhar 10% OFF'}
            </button>
          </form>

          {/* Privacy */}
          <p className="text-sm text-white/70 mt-4">
            🔒 Respeitamos sua privacidade. Sem spam, promessa!
          </p>
        </div>
      </div>
    </section>
  )
}