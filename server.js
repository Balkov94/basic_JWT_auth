require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// import { v4 as uuidv4 } from 'uuid';
const uuid = require('uuid');

const posts = require('./mockDB').posts;
const authenticate = require('./serverAuth').authenticate;
// require('./serverAuth');

app.use(express.json());

const port = 3000;
app.listen(port, () => {
    console.log("server is listening on port " + port);
});

app.get('/posts', authenticate, (req, res) => {
    // get the username by middlewear
    // we get the username (logged user) by token-decoding 
    // token = username + secret + jwt.sign()
    // username = token + secret + decoding (json.verify())
    const loggedUsername = req.username;
    const showPosts = posts.filter(p => p.username === loggedUsername);
    return res.status(200).send(showPosts);
})

app.get(`/posts/:id`, authenticate, (req, res) => {
    const postID = req.params.id
    const post = posts.filter(p => p.id === postID);
    return res.status(200).send(post);
})

app.post('/posts', authenticate, (req, res) => {
    const loggedUsername = req.username;
    const post = req.body.post;
    posts.push({ id: uuid.v4(), username: loggedUsername, post })
    return res.status(201).send("Successfully created new post.");
})

