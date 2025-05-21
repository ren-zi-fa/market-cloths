import { NextRequest, NextResponse } from 'next/server'


export async function middleware(request: NextRequest) {
   const refreshToken = request.cookies.get('refresh_token')

   

   // Jika tidak ada refresh_token dan akses halaman protected, redirect ke login
   if (
      !refreshToken &&
      (request.nextUrl.pathname.startsWith('/dashboard') ||
         request.nextUrl.pathname.startsWith('/profile'))
   ) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
   }

   // Jika sudah login, redirect dari login/register ke home
   if (
      refreshToken &&
      (request.nextUrl.pathname === '/auth/login' ||
         request.nextUrl.pathname === '/auth/register')
   ) {
      return NextResponse.redirect(new URL('/', request.url))
   }

   return NextResponse.next()
}

export const config = {
   matcher: [
      '/dashboard/:path*',
      '/profile/:path*',
      '/auth/login',
      '/auth/register'
   ]
}
