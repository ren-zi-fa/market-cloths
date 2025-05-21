import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'
import path from 'path'

const options = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'Market Cloths API',
         version: '1.0.0',
         description: 'API documentation for Market Cloths'
      },
      servers: [
         {
            url: 'http://localhost:3100' // Ganti port jika berbeda
         }
      ]
   },
   apis: [
      path.join(__dirname, '../router/*.ts') // Scan semua router untuk swagger doc
   ]
}

const swaggerSpec = swaggerJSDoc(options)

export function setupSwagger(app: Express) {
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
