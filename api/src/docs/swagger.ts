import path from 'path'
import vars from '../config/vars'

export const swaggerOptions = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'Market Cloths API',
         version: '1.0.0',
         description: `API documentation for Market Cloths.

**CORS Policy:**

This REST API is only accessible from the following origins:
- http://localhost:3000
- https://market-clozy.vercel.app/
- https://market-cloths.vercel.app/`
      },
      servers: [
         {
            url: vars.BASE_URL
         },
         {
            url: 'http://localhost:3100'
         }
      ]
   },
   apis: [path.join(__dirname, '../router/*.{ts,js}')]
}
