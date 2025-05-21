import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'
import path from 'path'
import vars from '../config/vars'

export const swaggerOptions = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'Market Cloths API',
         version: '1.0.0',
         description: 'API documentation for Market Cloths'
      },
      servers: [
         {
            url: vars.BASE_URL // Ganti port jika berbeda
         }
      ]
   },
   apis: [
      path.join(__dirname, '../router/*.ts') // Scan semua router untuk swagger doc
   ]
}



