const express = require('express');
const app = express();
const port = 3000;


app.get('/', (req, res) => {
    res.send('Página inicial')
})

app.get('/status', (req, res) => {
    res.send('Página da api')
})


app.get('/dados', (req, res) => {
    res.send('Página do banco de dados')
})


app.listen(port);