import path from 'path'
import express from 'express'
import { router } from '../router'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { notFoundMiddleware } from '../middlewares/notFoundMiddleware'
import { errorMiddleware } from '../middlewares/errorMiddleware'
import { setupSwagger } from '../swagger/swagger'

const app = express()
app.use(express.static(path.join(__dirname, '../public')))
app.use('/images', express.static(path.join(__dirname, '../../public/images')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const allowedOrigins = [
   'http://localhost:3000',
   'https://market-cloths-zy.vercel.app'
]

const corsOptions = {
   origin: (origin: any, callback: any) => {
      if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true)
      } else {
         callback(new Error('Not allowed by CORS'))
      }
   },
   credentials: true
}
app.use(cors(corsOptions))

// Setup Swagger sebelum routes lain
setupSwagger(app)

app.get('/', (req, res) => {
   res.json({ message: 'api is ok' })
})
app.use('/api', router)

// Not found & error handler harus di bawah semua route
app.use(notFoundMiddleware)
app.use(errorMiddleware)

export { app }
