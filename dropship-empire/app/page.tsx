import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import Benefits from '@/components/Benefits'
import Testimonials from '@/components/Testimonials'
import Newsletter from '@/components/Newsletter'
import UrgencyBanner from '@/components/UrgencyBanner'

export default function Home() {
  return (
    <main className="min-h-screen">
      <UrgencyBanner />
      <Hero />
      <Benefits />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
    </main>
  )
}
