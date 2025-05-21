import type { NextConfig } from 'next'
const backendUrl = process.env.BACKEND_URL || 'http://localhost:3100'
const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'res.cloudinary.com'
         }
      ]
   },
   async headers() {
      return [
         {
            source: '/(.*)',
            headers: [
               {
                  key: 'Access-Control-Allow-Origin',
                  value: 'https://market-cloths.vercel.app'
               },
               {
                  key: 'Access-Control-Allow-Credentials',
                  value: 'true'
               }
            ]
         }
      ]
   },
   async rewrites() {
      return [
         {
            source: '/:path*',
            destination: `${backendUrl}/:path*`
         }
      ]
   }
}

export default nextConfig
