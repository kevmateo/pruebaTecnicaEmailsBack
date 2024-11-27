
import User from "../models/user.model.js";
import Company from "../models/company.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

export const createUser = async (req, res) => {
  const { name, email } = req.body;
  console.log(req.body);
  try {

    // Verificar si la empresa existe
    const extraerCompania = (correo) => {
      const dominio = correo.split('@')[1]; 
      return dominio.slice(0);
    }

    const compania = extraerCompania(email);
    const existingCompany = await Company.findOne({ where: { domain: compania } });

    if (!existingCompany) {     
      return res.status(400).json({ error: 'Company not found' });
    }

    const user = await User.create({ name, email });
    console.log(user)
    res.status(200).json(user)
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Failed to create user" });
  }
}