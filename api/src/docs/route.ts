import { Express } from 'express'
import fs from 'fs'
import swaggerUi from 'swagger-ui-express'
import swagger from './swagger.json'

export default function docs(app: Express) {
   const cssPath = require.resolve('../../public/swagger/swagger-ui.css')
   const css = fs.readFileSync(cssPath, 'utf-8')
   app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swagger, {
         customCss: css
      })
   )
}
