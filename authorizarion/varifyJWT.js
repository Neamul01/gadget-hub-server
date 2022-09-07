const varifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send({ message: 'Unauthorized access' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.Access_Token_Secret, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden Access' })
        }
        req.decoded = decoded;
    })
    // console.log(token)
    next()
}
module.exports = varifyJWT;