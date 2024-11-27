import sequelize from '../sequalize/database.js';
import Company from './company.model.js';
import User from './user.model.js';
import Email from './email.model.js';

// Definir relaciones

// Relación entre User y Email (Emisor)
User.hasMany(Email, { foreignKey: 'senderId', as: 'sentEmails' });
Email.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

// Relación entre User y Email (Receptor)
User.hasMany(Email, { foreignKey: 'recipientId', as: 'receivedEmails' });
Email.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });

// Sincronización opcional (solo para desarrollo)
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true }); // Elimina y recrea las tablas (solo para desarrollo)
        console.log('Base de datos sincronizada correctamente.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

export { sequelize, Company, User, Email, syncDatabase };
