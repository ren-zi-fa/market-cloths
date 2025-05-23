import path from 'path'
import express from 'express'
import { router } from '../router'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { notFoundMiddleware } from '../middlewares/notFoundMiddleware'
import { errorMiddleware } from '../middlewares/errorMiddleware'
import docs from '../docs/route'
import vars from './vars'
const app = express()
app.use(express.static(path.join(__dirname, '../public')))
app.use('/images', express.static(path.join(__dirname, '../../public/images')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const allowedOrigins = [
   ...vars.FRONTEND_URL,
   'http://localhost:3000',
   'http://localhost:3100',
   'http://localhost:5173'
].filter(Boolean)

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

app.get('/', (req, res) => {
   res.json({ message: 'api is ok' })
})
app.use('/api', router)
docs(app)

// Not found & error handler harus di bawah semua route
app.use(notFoundMiddleware)
app.use(errorMiddleware)

export { app }
