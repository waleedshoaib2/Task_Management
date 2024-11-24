'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Tenant, { foreignKey: 'tenant_id' });
    }
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Name cannot be empty' },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { msg: 'Must be a valid email address' },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Password cannot be empty' },
        },
      },
      tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['admin', 'member']],
            msg: 'Role must be either admin or member',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  return User;
};
