import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  const orderNumber = `#TT${Math.floor(Math.random() * 100000)}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pedido Confirmado! 🎉
            </h1>

            <p className="text-lg text-gray-600 mb-2">
              Obrigado pela sua compra!
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Número do pedido:</p>
              <p className="text-2xl font-bold text-blue-600">{orderNumber}</p>
            </div>

            <p className="text-gray-600 mb-8">
              Enviámos um email de confirmação com todos os detalhes do seu pedido.
            </p>

            {/* What's Next */}
            <div className="space-y-4 text-left mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email de Confirmação</h3>
                  <p className="text-sm text-gray-600">Verifique seu email para os detalhes completos</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Preparação do Envio</h3>
                  <p className="text-sm text-gray-600">Seu pedido será enviado em 24-48 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Entrega Rápida</h3>
                  <p className="text-sm text-gray-600">Receberá seu pedido em 3-5 dias úteis</p>
                </div>
              </div>
            </div>

            {/* Cross-sell */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-2">
                🎁 Oferta Exclusiva para Si!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Como agradecimento, oferecemos 20% OFF na sua próxima compra!
              </p>
              <div className="bg-white rounded-lg px-4 py-2 inline-block">
                <span className="font-mono font-bold text-purple-600">OBRIGADO20</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Válido por 30 dias</p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/track"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Rastrear Pedido
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>

          {/* Recommended Products */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Clientes também compraram
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
                  <div className="h-32 bg-gray-100 rounded-lg mb-3"></div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">Produto Relacionado {i}</h3>
                  <p className="text-lg font-bold text-blue-600">29.99€</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}