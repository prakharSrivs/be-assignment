require("dotenv").config();
const jwt = require("jsonwebtoken")

const authenticateJWT = (req,res,next) => {
    const token = req.headers.auth;
    if(token)
    {
        jwt.verify( token, process.env.SECRET, (err,user)=>{
            if(err) return res.status(403).json({message:"Wrong Auth token"});
            req.name = user.name;
            req.id = user.id;
            next();
        })
    }
    else return res.sendStatus(401);
}

module.exports = authenticateJWT;