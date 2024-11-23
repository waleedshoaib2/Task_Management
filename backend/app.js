const express = require('express')

require('dotenv').config()

const pool = require('./config/db')
const app = express()
app.use(express.json())


app.get('/test', async (req, res)=>{
    try{
        const result = await pool.query('SELECT NOW ()');
        res.status(200).json({message: "Db connected and rows are "+ result.rows[0].now})
    }
    catch(error){
        console.error(error)
        res.status(500).json({error : "Db not connected"})

    }
})

const PORT = 3000;

app.listen(PORT, ()=>{
    console.log('The server is up and running')
})