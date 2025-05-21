// import swaggerJSDoc from 'swagger-jsdoc'

// export const swaggerSpec = swaggerJSDoc({
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'MARKET CLOTHS API',
//       version: '1.0.0',
//       description: 'Dokumentasi REST API Market-Cloths',
//     },
//   },
//   apis: ['./src/router/*.ts'],
// })

import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dokumentasi API',
      version: '1.0.0',
      description: 'Dokumentasi API Market Clothes',
    },
    servers: [
      {
        url: 'https://market-cloths.vercel.app', // sesuaikan URL
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/router/**/*.ts','./router/**/*.js'], // file route API untuk scan swagger-jsdoc
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  // Sajikan file swagger.json yang di-generate
  app.get('/api-docs/swagger.json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Redirect /api-docs ke halaman swagger-ui statis
  app.get('/api-docs', (_, res) => {
    res.redirect('/swagger-ui/');
  });
};
