const express = require('express');
const router = express.Router();
require('dotenv').config()
const client = require ('./client/client');
const fs = require('fs');
const bcrypt = require('bcrypt');

const ticketsRouter = require('./routes/ticketsRouter');
const usersRouter = require('./routes/usersRouter');

const app = express();
const port = 8000;
/* const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
}); */



app.use(express.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/' | '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();

});

app.use('/api/tickets',ticketsRouter);

app.use('/api/users',usersRouter);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

/* async function checkUser(username, password) {
    
    const sqlName = 'select * from users';
    const dataName = await client.query(sqlName);
    const listName = dataName.rows.map(data => data.user_name);
    const resultName = listName.includes(username);
    let userPasswordHash="";
    if(resultName){
        const sqlPassword = 'select password from users where user_name = $1';
        const dataPassword = await client.query(sqlPassword,[username]);
        userPasswordHash= dataPassword.rows.password;
    };
    
    const match = bcrypt.compareSync(password, userPasswordHash);

    if(match) {
        //login
        console.log(`Bonjour ${username} !!`);
    }

    //...
} */

