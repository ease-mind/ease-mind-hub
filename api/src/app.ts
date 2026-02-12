import express, { Application } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { setupSwagger } from './config/swagger'
import { connectToDatabase } from './config/mongodb'
import routes from './routes'
import path from 'path'

dotenv.config()

const app: Application = express()
const PORT = parseInt(process.env.PORT || '3000', 10)
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env')
  process.exit(1)
}

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api', routes)

setupSwagger(app)

// Start app after DB connection
connectToDatabase(MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`)
  })
})