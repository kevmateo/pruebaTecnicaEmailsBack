import { DataTypes } from 'sequelize';
import sequelize from '../sequalize/database.js';
import Company from './company.model.js';
import User from './user.model.js';

const Email = sequelize.define('Email', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  senderId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    },
    allowNull: false,
  },
  recipientId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    },
    allowNull: false,
  },
  sentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  smtpCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: 'emails',
  timestamps: false,
});

export default Email;
