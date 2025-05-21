import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger';
import fs from 'fs';
import path from 'path';

const swaggerSpec = swaggerJSDoc(swaggerOptions);

fs.writeFileSync(
  path.join(__dirname, 'swagger.json'),
  JSON.stringify(swaggerSpec, null, 2)
);

console.log('Swagger JSON generated!');