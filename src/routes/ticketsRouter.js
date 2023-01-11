const express = require('express');
const ticketsRouter = express.Router();

const client = require ('../client/client');




ticketsRouter.get("/", async (req, res) => {
    try {
        const data = await client.query('select * from tickets order by id');

        const result = { post: data.rows };

        data.rowCount >= 1 ? res.status(200).json({ status: "SUCCESS", data: result }) : res.status(200).json({ status: "NOT FOUND", message: "tableau vide !!" });

    }
    catch (err) {
        res.redirect()
        res.status(400).json({ status: "BAD REQUEST" });
    }
})
ticketsRouter.get("/:id", async (req, res) => {
    try {

        const id = req.params.id;

        const dataId = await client.query('select id from tickets order by id');
        const realId = dataId.rows.map(data => data.id);

        const sql = 'select * from tickets where id = $1';
        const data = await client.query(sql, [id]);
        const result = { post: data.rows };

        if (realId.includes(parseInt(id))) {

            data.rowCount === 1 ? res.status(200).json({ status: "SUCCESS", data: result }) : res.status(200).json({ status: "NOT FOUND" })
        }

        else {
            res.json({ status: "NOT FOUND", conseil: "vérifiez votre id dans la liste suivante", list: realId });
        }


    }
    catch (err) {

        res.status(404).json({ status: "NOT FOUND" });
        res.status(400).json({ status: "BAD REQUEST" });

    }
})
ticketsRouter.post("/", async (req, res) => {
    try {
        const message = req.body.message;
        if (message === ("" || null || undefined)) { res.status(406).json({ status: "FAIL", data: { message: "merci de saisir un message pour valider la requete !" } }); }

        const sql = 'insert into tickets (message) values ($1) returning *';

        const data = await client.query(sql, [message]);
        const result = { post: data.rows };

        res.status(201).json({ status: "CREATED", data: result })

    } catch (error) {
        res.status(404).json({ status: "BAD REQUEST" });
        res.status(400).json({ status: "BAD REQUEST" });
    }
})
ticketsRouter.put("/:id", async (req, res) => {
    try {

        const id = req.params.id;
        const message = req.body.message;
        const done = req.body.done;

        const sql = 'update tickets set (done,message) = ($3,$2) where id = $1';

        const data = await client.query(sql, [id, message, done]);

        data.rowCount === 1 ? res.status(200).json({ status: "NO CONTENT", done: "changed" }) : res.status(400).json({ status: "NO CONTENT", done: false, conseil: "vérifiez votre numéro de ticket" });

    } catch (error) {
        res.status(404).json({ status: "BAD REQUEST" });
        res.status(405).json({ status: "METHOD NOT ALLOWED" });
    }
})
ticketsRouter.delete("/:id", async (req, res) => {
    try {

        const id = req.params.id;

        const sql = 'delete from tickets where id = $1';
        const dataId = await client.query('select * from tickets where id = $1', [id]);

        const data = await client.query(sql, [id]);

        data.rowCount === 1 ? res.status(200).json({ status: "SUCCESS", data: null, deleted: true, lastSave: dataId.rows }) : res.status(400).json({ status: "NO CONTENT", deleted: false, conseil: "vérifiez votre numéro de ticket" });

    } catch (error) {

    }
})

module.exports =ticketsRouter ;