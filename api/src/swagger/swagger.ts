import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MARKET CLOTHS API',
      version: '1.0.0',
      description: 'Dokumentasi REST API Market-Cloths',
    },
  },
  apis: ['./src/router/*.ts'],
})
