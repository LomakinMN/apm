import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Booking } from './Booking';

@Table({
  tableName: 'events',
  timestamps: false
})
export class Event extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  })
  total_seats!: number;

  @HasMany(() => Booking)
  bookings!: Booking[];
}