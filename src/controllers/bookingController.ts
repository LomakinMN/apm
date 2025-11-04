import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Event, Booking } from '../models';
import { BookingResponse } from '../types/booking';

export const reserveBooking = async (req: Request, res: Response): Promise<Response<BookingResponse>> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Ошибка валидации',
        message: errors.array()[0].msg
      });
    }

    const { event_id, user_id } = req.body;

    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Событие не найдено'
      });
    }

    const existingBooking = await Booking.findOne({
      where: {
        event_id,
        user_id
      }
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        error: 'Пользователь уже забронировал место на это событие'
      });
    }

    const bookedSeats = await Booking.count({
      where: { event_id }
    });

    if (bookedSeats >= event.total_seats) {
      return res.status(422).json({
        success: false,
        error: 'Нет свободных мест на это событие'
      });
    }

    const transaction = await Booking.sequelize!.transaction();

    try {
      const booking = await Booking.create({
        event_id,
        user_id
      }, { transaction });

      await transaction.commit();

      return res.status(201).json({
        success: true,
        booking: {
          id: booking.id,
          event_id: booking.event_id,
          user_id: booking.user_id,
          created_at: booking.created_at
        },
        message: 'Место успешно забронировано'
      });

    } catch (transactionError) {
      await transaction.rollback();
      throw transactionError;
    }

  } catch (error) {
    console.error('Ошибка при бронировании:', error);
    
    if (error instanceof Error) {
      if (error.name === 'SequelizeDatabaseError') {
        return res.status(500).json({
          success: false,
          error: 'Ошибка базы данных'
        });
      }
      
      if (error.name === 'SequelizeConnectionError') {
        return res.status(503).json({
          success: false,
          error: 'Сервис временно недоступен'
        });
      }
    }

    return res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера'
    });
  }
};