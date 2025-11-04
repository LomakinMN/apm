import express from 'express';
import cors from 'cors';
import { sequelize } from './models';
import bookingRoutes from './routes/booking';
import {
  helmetConfig,
  rateLimiter,
  validateContentType,
  inputSanitizer
} from './middleware/security';

const app = express();

app.use(helmetConfig);
app.use(rateLimiter);
app.use(validateContentType);
app.use(inputSanitizer);


// CORS 
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://apm.com'] 
    : ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));

app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: 'OK',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'Service Unavailable',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// Маршруты
app.use('/api/bookings', bookingRoutes);

// app.use('*', (req, res) => {
//   res.status(404).json({
//     error: 'Endpoint не найден',
//     message: `Маршрут ${req.originalUrl} не существует`
//   });
// });

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);
  
  if (error.status === 400) {
    return res.status(400).json({
      error: 'Ошибка валидации',
      message: error.message
    });
  }

  res.status(500).json({
    error: 'Внутренняя ошибка сервера',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Что-то пошло не так'
  });
});

export default app;