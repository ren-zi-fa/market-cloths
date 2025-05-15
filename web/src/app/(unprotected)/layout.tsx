import { agdasima } from '@/components/fonts'
import Navbar from '@/components/Navbar'

export default function BaseLayout({
   children
}: {
   children: React.ReactNode
}) {
   return (
      <main className={`${agdasima.className} tracking-widest  antialiased`}>
         <Navbar />
         {children}
      </main>
   )
}
