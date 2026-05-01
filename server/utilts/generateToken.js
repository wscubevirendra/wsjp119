var jwt = require('jsonwebtoken');


function generateToken(id) {
    const token = jwt.sign(
        { id }, // payload should be object
        process.env.SECRET_KEY,
        { expiresIn: "30d" } // correct option
    );
    return token;
}

module.exports = generateToken