
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET || "secret";


const singnToken = (user) => {
    const token = jwt.sign(user, secret, { expiresIn: "15m" });
    return token    
}

const validateToken = async (req, res, next) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(token == undefined || token == null || token == "") return res.sendStatus(401).send("el token no puede ir vacio");
  
    try {
        const verifyToken = jwt.verify(token, secret)        
        next()

    } catch (error) {
        res.status(401).send('Token invalid or has expired')    
    }   

};


module.exports={validateToken,singnToken}