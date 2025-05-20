import { app } from './config/express'
import config from './config/vars'

app.listen(config.port, () => {
   console.log(`APP is running on http://localhost:${config.port}  `)
   console.log(`Swagger docs at http://localhost:${config.port}/docs`)
})

export default app
