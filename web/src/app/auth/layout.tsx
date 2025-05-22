import CheckAuth from './_components/CheckToken'

export default function AuthLayout({
   children
}: {
   children: React.ReactNode
}) {
   return (
      <main className={` tracking-widest  antialiased`}>
         <CheckAuth>{children}</CheckAuth>
      </main>
   )
}
