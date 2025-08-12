import { prisma } from '@/lib/prisma'
import ProductCard from './ProductCard'

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      featured: true
    },
    take: 8,
    orderBy: {
      createdAt: 'desc'
    }
  })
  return products
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Produtos em <span className="text-blue-600">Destaque</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Os gadgets mais vendidos e inovadores. Stock limitado - garanta o seu antes que acabe!
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Ver Todos os Produtos
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}