import { agdasima } from '@/components/fonts'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { CartProvider } from '@/hooks/use-cart'
import { ProfileProvider } from '@/hooks/use-profile'

export default function BaseLayout({
   children
}: {
   children: React.ReactNode
}) {
   return (
      <main className={`${agdasima.className} tracking-widest  antialiased`}>
         <ProfileProvider>
            <CartProvider>
               <Navbar />
               {children}
            </CartProvider>
            <Footer />
         </ProfileProvider>
      </main>
   )
}
