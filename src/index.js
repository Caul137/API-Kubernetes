const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;


const dbconfig = {
    host: process.env.DB_HOST || 'app-db-svc.desafio-db.svc.cluster.local',
    user: process.env.MYSQL_USER,         
    password: process.env.MYSQL_ROOT_PASSWORD, 
    database: process.env.MYSQL_DATABASE     
}

const pool = mysql.createPool(dbconfig)

app.get('/', (req, res) => {
    res.send('Página inicial')
})

app.get('/status', (req, res) => {
    pool.query('SELECT 1 + 1 AS solution', (error) => {
        if (error) {
            return res.status(500).send('Erro na conexão: ' + error.message);
        }
        res.send('Página da api online e conectada com o banco!')
    })
})


app.get('/dados', (req, res) => {
  pool.query('SELECT NOW() as hora_atual', (error, results) => {
        if (error) {
            return res.status(500).send('Erro ao buscar dados: ' + error.message);
        }
        res.send(`Página do banco de dados - Hora no MySQL: ${results[0].hora_atual}`);
    });
})


app.listen(port);