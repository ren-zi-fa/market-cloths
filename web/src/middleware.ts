import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
   const refreshToken = request.cookies.get('refresh_token')

   // Proteksi halaman login/register
   if (
      refreshToken &&
      (request.nextUrl.pathname === '/auth/login' ||
         request.nextUrl.pathname === '/auth/register')
   ) {
      return NextResponse.redirect(new URL('/', request.url))
   }
   // Proteksi halaman dashboard/profile
   if (
      !refreshToken &&
      (request.nextUrl.pathname.startsWith('/dashboard') ||
         request.nextUrl.pathname.startsWith('/profile'))
   ) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
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
