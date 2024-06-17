require('dotenv').config()
const express = require('express')
const cors = require('cors');
const mysql = require('mysql2/promise')
const client = mysql.createPool(process.env.CONNECTION_STRING)


async function getUser(){
    const results = await client.query('SELECT * FROM usuarios')
    return results
}

const app = express()
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Acces-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Acces-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', true);
    next();
})

app.get('/usuario/:email/:senha', async (req, res) => {
    const results = await client.query(`SELECT * FROM usuario WHERE email='${req.params.email}' and senha='${req.params.senha}';`)
    //console.log(results[0][0].id)
    res.json(results[0])
    //return results[0]
})

app.get('/usuario-secao/:id', async (req, res) => {
    const results = await client.query(`SELECT * FROM usuario_secao WHERE usuario='${req.params.id}' ;`)
    res.json(results[0])
    //return results[0]
})

app.get('/vendas/:data/:secoes', async (req, res) => {
    let sec = JSON.parse(req.params.secoes)
    let oii = sec.map( function(el) { return el.id; })

    //console.log(`SELECT * FROM rel_parcial where secao IN ${client.escape(oii)}, function(err_res, results){};`)
    const results = await client.query(`SELECT * FROM rel_parcial where secao IN ('${client.escape(oii)}') and data='${req.params.data}';`)
    //query( "select * from `contents` where `user_is` IN ("+ connection.escape(arr)+")", function( err_user, result_user ) { });
    res.json(results[0])
    //return results[0]
})

app.listen(process.env.PORT, () => {
    console.log('Servidor iniciado com sucesso na porta '+process.env.PORT)
})