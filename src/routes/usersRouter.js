const express = require('express');
const usersRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require ('../client/client');

const secreToken = "toctoken";

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        res.send("Token manquant !!");
    } else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err) {
                console.log(err);
                res.json({ auth: false, message: "Authentification échouée !!"});
            } else {
                req.userId = decoded.id;
                next();
            }
        });
    }
};

usersRouter.get('/',async (req,res) => {
    try {
        
        const sql = 'select user_name from users';

        const data = await client.query(sql);

        res.status(200).json({status:"OK",data: {post : data.rows}})

    } catch (error) {
        res.status(404).json({ status: "BAD REQUEST" });
    }
})
usersRouter.post('/register', async (req, res) => {


    const user_name = req.body.user_name;
    const password = req.body.password;

    const sqlName = 'select user_name from users';
    const dataName = await client.query(sqlName);

    const listName = dataName.rows.map(data => data.user_name);

    if (listName.includes(user_name)) { res.status(400).json({ status: "BAD REQUEST", message: "votre nom existe déjà !!" }); return}

    bcrypt.hash(password, 10, async function (err, hash) {
        // Store hash in your password DB.
        try {

            const sql = 'insert into users (user_name,password) values ($1,$2) returning *';

            const data = await client.query(sql, [user_name, hash]);

            res.json(data.rows);

        }
        catch (error) {
            res.status(404).json({ status: "BAD REQUEST" });
        };
    });






})

usersRouter.post('/login', async (req, res) => {
    try {


        const user_name = req.body.user_name;
        const password = req.body.password;

        const sqlName = 'select * from users';
        const dataName = await client.query(sqlName);
        const listName = dataName.rows.map(data => data.user_name);
        const resultName = listName.includes(user_name);
        console.log(resultName);

        if (resultName) {
            const sqlPassword = 'select password from users where user_name = $1';
            const dataPassword = await client.query(sqlPassword, [user_name]);

            const hash = dataPassword.rows[0].password;
            console.log(hash);
            bcrypt.compare(password, hash, function (err, result) {
                
                const token = jwt.sign({user_name},"jwtSecret",{expiresIn:"1h"});
                console.log(token);

                result ? res.status(200).json({status:"OK",auth: true,token : token,message : `Bonjour ${user_name}`}) : res.status(401).json({status:"Unauthorized",message : `Mot de passe ne correpond pas !!`}) ;
                
                
                return ; 
            });
        }
        else{
            res.status(401).json({status:"Unauthorized", message:`UserName ${user_name} inconnu !!`})
        }

    } catch (error) {
        res.status(404).json({ status: "BAD REQUEST" });
    }
});

usersRouter.get('/isUserAuth', verifyJWT , (req, res) => {
    res.send({message: "You are authenticated Congrats:"})
})

module.exports = usersRouter ;