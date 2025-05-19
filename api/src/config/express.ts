import path from 'path'
import express from 'express'
import { router } from '../router'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { notFoundMiddleware } from '../middlewares/notFoundMiddleware'
import { errorMiddleware } from '../middlewares/errorMiddleware'
const app = express()

app.use('/images', express.static(path.join(__dirname, '../../public/images')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(notFoundMiddleware)
app.use(errorMiddleware)
const corsOptions = {
   origin: 'http://localhost:3000',
   credentials: true
}

app.use(cors(corsOptions))
app.get('/', (req, res) => {
   res.json({ message: 'api is ok' })
})
app.use('/api', router)

export { app }
