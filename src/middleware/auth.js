import jwt from 'jsonwebtoken';

const authToken = (req, res, next) => {
    //recupere le token depuis le header "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({
            message : "Non autorisé"
        });
    }

    try {
        //verifie le token :
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch (error) {
        return res.status(403).json({
            message: "Non autorisé"
        })
    }
}

export default authToken;