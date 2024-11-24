'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Tenant extends Model {
    static associate(models) {
    }
  }

  Tenant.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize, 
      modelName: 'Tenant',
    }
  );

  Tenant.beforeCreate(async (tenant) => {
    if (tenant.password) {
      tenant.password = await bcrypt.hash(tenant.password, 10);
    }
  });

  Tenant.beforeUpdate(async (tenant) => {
    if (tenant.changed('password')) {
      tenant.password = await bcrypt.hash(tenant.password, 10);
    }
  });

  return Tenant;
};
