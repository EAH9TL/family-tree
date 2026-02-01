import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import personRoutes from './routes/personRoutes';
import medicalRoutes from './routes/medicalRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/medical', medicalRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Árbol Genealógico funcionando' });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});