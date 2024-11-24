const { Tenant } = require('../models');
const jwt = require('jsonwebtoken');


exports.createTenant = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingTenant = await Tenant.findOne({ where: { email } });
    if (existingTenant) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const tenant = await Tenant.create({ name, email, password });
    const token = jwt.sign({ tenantId: tenant.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, tenant });
  } catch (error) {
    console.log("the error we got", error)
    res.status(500).json({ error: 'Failed to create tenant' });
  }
};

exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
};

exports.getTenantById = async (req, res) => {
  const { id } = req.params;

  try {
    const tenant = await Tenant.findByPk(id);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
};

exports.updateTenant = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const tenant = await Tenant.findByPk(id);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    await tenant.update({ name, email, password });
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tenant' });
  }
};

exports.deleteTenant = async (req, res) => {
  const { id } = req.params;

  try {
    const tenant = await Tenant.findByPk(id);
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    await tenant.destroy();
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tenant' });
  }
};
