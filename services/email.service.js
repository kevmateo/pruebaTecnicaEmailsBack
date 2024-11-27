
import Company from '../models/company.model.js';
import Email from '../models/email.model.js';
import User from '../models/user.model.js';
import { Op } from 'sequelize';

export const getEmails = async (req, res) => {
  const { page, pageSize } = req.query;
  const limit = parseInt(pageSize, 10);
  const offset = (parseInt(page, 10) - 1) * limit;

  try {
    // Obtener correos y total de registros
    const { rows: emails, count: total } = await Email.findAndCountAll({
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'recipient', attributes: ['id', 'name', 'email'] },
      ],
      limit,
      offset,
    });

    // Responder con correos y el total
    res.json({
      emails,
      total,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching emails:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const createEmail = async (req, res) => {
  const { senderId, recipientId, sentDate, smtpCode, content } = req.body;
  console.log(req.body);
  try {

    // Verificar que smtpCode sea único
    const existingEmail = await Email.findOne({ where: { smtpCode } });
    if (existingEmail) {
      return res.status(400).json({ error: 'SMTP Code must be unique' });
    }

    // Validar si el emisor y receptor existen
    const sender = await User.findByPk(senderId);
    const recipient = await User.findByPk(recipientId);
    if (!sender || !recipient) {
      return res.status(400).json({ error: 'Sender or recipient not found' });
    }

    const email = await Email.create({ senderId, recipientId, sentDate, smtpCode, content });
    res.json(email);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmail = async (req, res) => {
  const { id } = req.params;
  const { senderId, recipientId, sentDate, smtpCode, content, companyId } = req.body;

  try {
    const email = await Email.findByPk(id);
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const updatedEmail = await email.update({ senderId, recipientId, sentDate, smtpCode, content, companyId });
    res.json(updatedEmail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEmail = async (req, res) => {
  const { id } = req.params;

  try {
    const email = await Email.findByPk(id);
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    await email.destroy();
    res.status(204).send(); // Respuesta sin contenido
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchByEmail = async (req, res) => {
  const { page = 1, pageSize = 10, content } = req.query;
  const limit = parseInt(pageSize, 10);
  const offset = (parseInt(page, 10) - 1) * limit;

  try {
    const emails = await Email.findAndCountAll({
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'recipient', attributes: ['id', 'name', 'email'] },
      ],
      where: {
        [Op.or]: [
          { content: content ? { [Op.iLike]: `%${content}%` } : undefined }, // Usar ILIKE para insensibilidad
        ].filter(Boolean), // Filtra condiciones undefined
      },
      limit,
      offset,
    });

    res.json({
      emails: emails.rows,
      total: emails.count,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(emails.count / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const paginationEmails = async (req, res) => {
  const { page, pageSize } = req.query;
  const limit = pageSize || 10;
  const offset = page ? (page - 1) * limit : 0;

  try {
    const emails = await Email.findAndCountAll({
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'recipient', attributes: ['id', 'name', 'email'] },
        { model: Company, as: 'company', attributes: ['id', 'name', 'domain'] },
      ],
      limit,
      offset,
    });
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const countEmails = async (req, res) => {
  try {
    const count = await Email.count();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
