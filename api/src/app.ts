import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupSwagger } from './config/swagger';
import { connectToDatabase } from './config/mongodb';
import routes from './routes';
import path from 'path';
import User from './models/userModel';

dotenv.config();

const app: Application = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env');
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api', routes);

setupSwagger(app);

connectToDatabase(MONGODB_URI).then(async () => {
  try {
    await User.collection.dropIndex('document_1');
    console.log('🗑️  Index document_1 removed from users collection (if it existed)');
  } catch (err: any) {
    if (err?.codeName !== 'IndexNotFound') {
      console.error('Erro ao remover índice document_1:', err?.message ?? err);
    }
  }

  const HOST = process.env.HOST || '0.0.0.0';
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    if (HOST === '0.0.0.0') {
      console.log(`   (aceitando conexões da rede — use o IP desta máquina no app, ex.: http://<SEU_IP>:${PORT}/api)`);
    }
  });
});