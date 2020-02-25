const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        var token 
        if(req.headers.authorization){
            token = req.headers.authorization.split(" ")[1];
        }
        if(!token){
            //fallback/check request params for token
            console.log('in fallback');
            token = req.body.authorization;
        }
        const decoded = jwt.verify(token, 'secret');
        console.log("DECODED = %s", JSON.stringify(decoded));
        req.userData = decoded;
        next();
    }catch(error){
        console.log("token authorization missing or invalid");
        return res.status(401).json({
            message : 'Authorization failed/missing'
        })
    }
}