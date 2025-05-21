import path from 'path'
import express from 'express'
import { router } from '../router'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { notFoundMiddleware } from '../middlewares/notFoundMiddleware'
import { errorMiddleware } from '../middlewares/errorMiddleware'
import { options } from '../swagger/swagger'
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

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
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

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

const specs = swaggerJsDoc(options);
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(specs, { customCssUrl: CSS_URL })
);

app.get('/', (req, res) => {
   res.json({ message: 'api is ok' })
})
app.use('/api', router)

// Not found & error handler harus di bawah semua route
app.use(notFoundMiddleware)
app.use(errorMiddleware)

export { app }
