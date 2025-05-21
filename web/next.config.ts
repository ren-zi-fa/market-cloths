import type { NextConfig } from 'next'

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
   }
}

export default nextConfig
