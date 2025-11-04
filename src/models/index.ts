import { Sequelize } from 'sequelize-typescript';
import { Event } from './Event';
import { Booking } from './Booking';

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'booking_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: 'postgres',
  models: [Event, Booking],
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export { sequelize, Event, Booking };