const jwt = require('jsonwebtoken');

exports.authorizationsignup = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        console.log(decodedToken);
        const role = decodedToken.jobRole;
        if (role !== "admin") {

            return res.status(401).json({
                error: "UnAuthorized",
                status: "error"
            });
        } else {
            next()
        }
    } catch {
        res.status(401).json({
            error: "Unauthorized",
            status: "error"
        })
    }
}

exports.authorization = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const role = decodedToken.jobRole;
        if (!role) {
            return res.status(401).json({
                error: "UnAuthorized",
                status: "error"
            });
        } else {
            next()
        }
    } catch {
        res.status(401).json({
            error: "Unauthorized",
            status: "error"
        })
    }
}