import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpar dados existentes
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.product.deleteMany()

  // Produtos VENCEDORES com alta margem de lucro
  const products = [
    {
      name: "SmartWatch Ultra Pro 2024",
      slug: "smartwatch-ultra-pro",
      description: "Relógio inteligente com ECG, medidor de pressão, 100+ modos desportivos. Bateria 7 dias!",
      price: 89.99,
      comparePrice: 199.99,
      cost: 22.50, // Custo real do fornecedor
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12"
      ]),
      category: "Tech",
      tags: JSON.stringify(["bestseller", "trending", "fitness"]),
      featured: true,
      bestseller: true,
      rating: 4.9,
      reviews: 2847,
      supplier: "https://cjdropshipping.com/product/smartwatch"
    },
    {
      name: "Posture Corrector Pro - Corretor Postural Invisível",
      slug: "posture-corrector-pro",
      description: "Melhore sua postura em 2 semanas! Invisível sob a roupa. Recomendado por fisioterapeutas.",
      price: 39.99,
      comparePrice: 89.99,
      cost: 8.90,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
      ]),
      category: "Health",
      tags: JSON.stringify(["health", "posture", "back-pain"]),
      featured: true,
      bestseller: true,
      rating: 4.7,
      reviews: 1523
    },
    {
      name: "Mini Projetor 4K WiFi - Cinema em Casa",
      slug: "mini-projector-4k",
      description: "Transforme qualquer parede num cinema! 4K, WiFi, compatível com todos dispositivos.",
      price: 149.99,
      comparePrice: 399.99,
      cost: 45.00,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64"
      ]),
      category: "Tech",
      tags: JSON.stringify(["entertainment", "4k", "portable"]),
      featured: true,
      rating: 4.8,
      reviews: 892
    },
    {
      name: "Neck Cloud - Almofada Cervical Ortopédica",
      slug: "neck-cloud-pillow",
      description: "Acabe com as dores no pescoço! Suporte cervical perfeito. Sono profundo garantido.",
      price: 59.99,
      comparePrice: 129.99,
      cost: 12.50,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2",
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2"
      ]),
      category: "Health",
      tags: JSON.stringify(["sleep", "health", "orthopedic"]),
      bestseller: true,
      rating: 4.9,
      reviews: 3421
    },
    {
      name: "EarPods Pro Noise Cancelling",
      slug: "earpods-pro-anc",
      description: "Som premium com cancelamento de ruído ativo. 48h bateria. Melhor que AirPods!",
      price: 79.99,
      comparePrice: 249.99,
      cost: 18.90,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df"
      ]),
      category: "Tech",
      tags: JSON.stringify(["audio", "wireless", "anc"]),
      featured: true,
      rating: 4.8,
      reviews: 1876
    },
    {
      name: "Magnetic Phone Holder Pro - Suporte Magnético Universal",
      slug: "magnetic-phone-holder",
      description: "Super íman! Rotação 360°. Compatível com todos telemóveis. Instalação em 1 segundo!",
      price: 24.99,
      comparePrice: 49.99,
      cost: 4.50,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1619134778706-7015533a6150",
        "https://images.unsplash.com/photo-1619134778706-7015533a6150"
      ]),
      category: "Accessories",
      tags: JSON.stringify(["car", "phone", "magnetic"]),
      rating: 4.6,
      reviews: 5234
    },
    {
      name: "LED Strip Lights RGB - 20 Metros com App",
      slug: "led-strip-lights-rgb",
      description: "Transforme sua casa! Controlo por app, sincroniza com música, 16 milhões de cores!",
      price: 44.99,
      comparePrice: 99.99,
      cost: 11.20,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1565636192335-e91b874e5e12",
        "https://images.unsplash.com/photo-1565636192335-e91b874e5e12"
      ]),
      category: "Home",
      tags: JSON.stringify(["lighting", "smart-home", "rgb"]),
      featured: true,
      rating: 4.7,
      reviews: 2341
    },
    {
      name: "Anti-Spy Camera Detector - Proteção Total",
      slug: "anti-spy-detector",
      description: "Deteta câmaras escondidas, microfones, GPS! Proteja sua privacidade em hotéis e Airbnb.",
      price: 69.99,
      comparePrice: 149.99,
      cost: 15.80,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0"
      ]),
      category: "Security",
      tags: JSON.stringify(["privacy", "security", "detector"]),
      rating: 4.9,
      reviews: 876
    },
    {
      name: "Portable Blender USB - Batidos em Qualquer Lugar",
      slug: "portable-blender-usb",
      description: "6 lâminas aço inox! Carrega por USB. Faz batidos em 40 segundos. Leva para o ginásio!",
      price: 34.99,
      comparePrice: 79.99,
      cost: 9.90,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1570222094114-d054a817e56b",
        "https://images.unsplash.com/photo-1570222094114-d054a817e56b"
      ]),
      category: "Kitchen",
      tags: JSON.stringify(["portable", "fitness", "smoothie"]),
      rating: 4.6,
      reviews: 1234
    },
    {
      name: "Smart Ring Health Tracker - Anel Inteligente",
      slug: "smart-ring-tracker",
      description: "Monitoriza sono, batimentos, calorias, stress. Discreto e elegante. 7 dias bateria!",
      price: 129.99,
      comparePrice: 299.99,
      cost: 28.50,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15",
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15"
      ]),
      category: "Tech",
      tags: JSON.stringify(["health", "wearable", "smart"]),
      featured: true,
      bestseller: true,
      rating: 4.8,
      reviews: 567
    }
  ]

  // Inserir produtos
  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  console.log('✅ Base de dados populada com 10 produtos vencedores!')
  console.log('💰 Margem média de lucro: 350%')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })