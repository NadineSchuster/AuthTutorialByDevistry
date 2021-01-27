const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.header("x-auth-token");

    try {
        if(!token)
        {
            return res
                .status(401)
                .json({ msg: "No authentication token, authorization denied" });

        }
        
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        })

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = auth;