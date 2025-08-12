import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Shield, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Tech<span className="text-blue-500">Trend</span>
            </h3>
            <p className="text-sm mb-4">
              A sua loja de confiança para gadgets inovadores. Produtos selecionados, 
              preços imbatíveis e entrega rápida.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition">Todos os Produtos</Link></li>
              <li><Link href="/bestsellers" className="hover:text-white transition">Mais Vendidos</Link></li>
              <li><Link href="/deals" className="hover:text-white transition">Promoções</Link></li>
              <li><Link href="/track" className="hover:text-white transition">Rastrear Pedido</Link></li>
              <li><Link href="/about" className="hover:text-white transition">Sobre Nós</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-white mb-4">Apoio ao Cliente</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shipping" className="hover:text-white transition">Informação de Envio</Link></li>
              <li><Link href="/returns" className="hover:text-white transition">Devoluções & Trocas</Link></li>
              <li><Link href="/warranty" className="hover:text-white transition">Garantia</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">Perguntas Frequentes</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contacte-nos</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contactos</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>suporte@techtrend.pt</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+351 900 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Lisboa, Portugal</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Pagamento 100% Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="w-5 h-5" />
              <span>Aceitamos:</span>
              <div className="flex gap-2">
                <span className="bg-white text-gray-900 px-2 py-1 rounded text-xs font-semibold">VISA</span>
                <span className="bg-white text-gray-900 px-2 py-1 rounded text-xs font-semibold">MasterCard</span>
                <span className="bg-white text-gray-900 px-2 py-1 rounded text-xs font-semibold">PayPal</span>
                <span className="bg-white text-gray-900 px-2 py-1 rounded text-xs font-semibold">MB Way</span>
              </div>
            </div>
            <div className="text-sm text-center md:text-right">
              <p>© 2024 TechTrend. Todos os direitos reservados.</p>
              <div className="flex gap-4 mt-2 justify-center md:justify-end">
                <Link href="/privacy" className="hover:text-white transition">Privacidade</Link>
                <Link href="/terms" className="hover:text-white transition">Termos</Link>
                <Link href="/cookies" className="hover:text-white transition">Cookies</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}