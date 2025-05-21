import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'
import path from 'path'
import vars from '../config/vars'

export const options = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'Market Cloths API',
         version: '1.0.0',
         description: 'API documentation for Market Cloths'
      },
      servers: [
         {
            url: vars.BASE_URL,
            description: 'Market cloths  Documentation'
         }
      ]
   },
   apis: [path.join(__dirname, '../router/*.ts')]
}
