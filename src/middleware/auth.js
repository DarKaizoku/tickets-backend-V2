const jwt = require('jsonwebtoken');
const secreToken = "toctoken";

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1]; // permet de supprimer "Bearer" de authorization !!
    console.log(req.headers);
    if (!token) {
        res.send("Token manquant !!");
    } else {
        jwt.verify(token, secreToken, (err, decoded) => {
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

module.exports = verifyJWT ;