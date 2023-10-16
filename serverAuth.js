require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const users = require('./mockDB').users;

app.use(express.json());

const port = 4000;
app.listen(port, () => {
    console.log("auth server is listening on port " + port);
});


app.post('/register', async (req, res) => {
    // we hash the password for DB (not to storeit in raw format)
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = { id: uuid.v4(), username: req.body.username, password: hashedPassword };

    if (newUser && !users.find(u => u.username === newUser.username)) {
        users.push(newUser);
        return res.status(201).send("Successfully registered.");
    }
    else {
        return res.status(400).send("Username already exists.");
    }
})

app.post('/login', async (req, res) => {
    //Authenticate user
    const currUser = { username: req.body.username, password: req.body.password };
    if (!currUser) {
        return res.status(400).send("Invalid input data.");
    }

    const dbUser = users.find(u => u.username === currUser.username);

    try {
        // SECURE Compare input password with hashed password from DB
        if (await bcrypt.compare(currUser.password, dbUser.password)) {
            // IF both password matches => give ACCESS TOKEN
            const accessToken = jwt.sign(currUser.username, process.env.ACCESS_TOKEN_SECRET);
            return res.status(200).send({ token: accessToken, message: "Successfull login." });
        }
        else {
            return res.status(401).send("Invalid username or password.");
        }
    } catch {
        return res.status(500).send("Invalid username or password.");
    }
});

// middleware autheticate
function autheticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send('Unauthorized, pleas login first.'); // not authenticated (require TOKEN)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
        if (err) return res.status(403).send(`JWT error message: ${err.message}`); // TOKEN is not correct (expired / secret or username mismathched)
        req.username = decodedToken;
        next();
        // if token is correct go to next with added username to the next request
    });
}

module.exports = {
    authenticate: autheticate,
}
