import 'dotenv/config';
import app from './app';
import { sequelize } from './models';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {

    await sequelize.authenticate();
    console.log('Подключение к PostgreSQL установлено');


    await sequelize.sync({ force: false });
    console.log('Модели синхронизированы с БД');

    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });

  } catch (error) {
    console.error('Не удалось запустить сервер:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  console.log('SIGTERM получен, завершаем работу...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT получен, завершаем работу...');
  await sequelize.close();
  process.exit(0);
});

startServer();