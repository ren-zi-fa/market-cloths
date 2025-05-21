import path from 'path'
import dotenv from 'dotenv'

// Gantikan __dirname
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// Export config
export default {
   port: process.env.PORT as string,
   node_env: process.env.NODE_ENV as string,
   FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT as string,
   JWT_SECRET: process.env.JWT_SECRET as string,
   REFRESH_TOKEN_MAX_AGE:
      Number(process.env.REFRESH_TOKEN_MAX_AGE) || 2592000000,
   ACCESS_TOKEN_MAX_AGE: Number(process.env.ACCESS_TOKEN_MAX_AGE) || 900000,
   LIMIT_PRODUCT: Number(process.env.LIMIT_PRODUCT) || 20,
   BASE_URL: (process.env.BASE_URL as string) || 'http://localhost:3100',
   FRONTEND_URL: process.env.FRONTEND_URL
      ? JSON.parse(process.env.FRONTEND_URL)
      : []
}
