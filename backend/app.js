require('dotenv').config(); 

const express = require('express')
const {Sequelize } = require('sequelize')
const tenantRoutes = require('./routes/tenant');
const userRoutes = require('./routes/user')
const app = express()

const sequelize = new Sequelize(

    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.HOST,
        dialect: 'postgres'
    }
);

app.use(express.json()); 
app.use('/tenants', tenantRoutes); 
app.use('/users', userRoutes);

app.listen(3000, ()=>{console.log("server is running")})