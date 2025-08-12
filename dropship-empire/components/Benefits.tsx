import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react'

const benefits = [
  {
    icon: Truck,
    title: 'Envio Grátis',
    description: 'Em pedidos acima de 50€'
  },
  {
    icon: Shield,
    title: 'Pagamento Seguro',
    description: '100% protegido com SSL'
  },
  {
    icon: RefreshCw,
    title: '30 Dias Garantia',
    description: 'Devolução sem perguntas'
  },
  {
    icon: Headphones,
    title: 'Suporte 24/7',
    description: 'Estamos sempre aqui'
  }
]

export default function Benefits() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}