const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;


const dbconfig = {
    host: process.env.DB_HOST || 'app-db-svc.desafio-db.svc.cluster.local',
    user: 'root',         
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

/* Este SELECT 1+1 nós chamamos de Ping Query. Serve para perguntar ao MySQL se ele está vivo e ouvindo, é como um Health Check. 
   O kubernetes chama este endpoint em um interavlo que definimos em deployment-api.yaml para saber se a aplicação está saudável.
   Se o banco de dados travar ou a rede cair, o 1 + 1 vai falhar (retornar error), a API vai responder com erro 500, e o Kubernetes saberá que aquele Pod da API não deve receber tráfego porque não consegue falar com o banco.
   Se o MySQL retornar 2, significa que: A rede entre a API e o Banco está funcionando.
   O usuário e senha estão corretos.
   O serviço do MySQL está rodando e aceitando comandos.
*/


app.get('/dados', (req, res) => {
  pool.query('SELECT texto, NOW() as hora_atual FROM mensagens LIMIT 1', (error, results) => {
    if (error) {
      return res.status(500).send('Erro ao buscar dados: ' + error.message);
    }

    if (results.length === 0) {
      return res.send('Banco conectado, mas a tabela "mensagens" está vazia.');
    }

    const textoDB = results[0].texto;
    const horaDB = results[0].hora_atual;

    res.send(`
      <h1>Status do Banco de Dados</h1>
      <p><b>Conteúdo persistido:</b> ${textoDB}</p>
      <p><b>Hora atual no MySQL:</b> ${horaDB}</p>
    `);
  });
});


app.listen(port);