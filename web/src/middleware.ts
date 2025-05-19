import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
   const refreshToken = request.cookies.get('refresh_token')
   const accessToken = request.cookies.get('access_token')
   const { pathname } = request.nextUrl

   // Proteksi halaman login/register
   if (
      refreshToken &&
      (pathname === '/auth/login' || pathname === '/auth/register')
   ) {
      return NextResponse.redirect(new URL('/', request.url))
   }

   // Proteksi halaman dashboard/profile
   if (
      !refreshToken &&
      (pathname.startsWith('/dashboard') || pathname.startsWith('/profile'))
   ) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
   }

   // Jangan redirect ke refresh jika sudah di /dashboard/refresh
   if (!accessToken && pathname !== '/dashboard/refresh') {
      return NextResponse.redirect(new URL('/dashboard/refresh', request.url))
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
