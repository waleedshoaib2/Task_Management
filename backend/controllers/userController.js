const { User, Tenant } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  const { name, email, password, tenant_id, role } = req.body;

  try {
    const tenant = await Tenant.findByPk(tenant_id);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
     const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
     const user = await User.create({ name, email, password, tenant_id, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: [{ model: Tenant }] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, { include: [{ model: Tenant }] });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.update({ name, email, password, role });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};


exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const isPasswordValid = await user.validPassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
      const token = jwt.sign(
        { userId: user.id, tenantId: user.tenant_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Failed to log in' });
    }
  };
  
