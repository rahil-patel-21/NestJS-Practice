import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID,
    allowNull: false,
  })
  id: string;

  @Column({
    allowNull: false,

    type: DataType.STRING,
    unique: true,
  })
  username: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  password: string;

  @Column({
    allowNull: false,
    type: DataType.ARRAY(DataType.STRING),
  })
  fcmToken: string[];

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  deviceID: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM,
    values: ['Android', 'IOS', 'Web'],
  })
  deviceType: string;
}
