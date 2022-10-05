const express = require('express');
const bodyParser = require('body-parser');

const userRoute = require('./routes/user');
const loginRoute = require('./routes/login');

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: false
}));
app.enable('trust proxy')

app.use("/user", userRoute);
app.use("/login", loginRoute);

module.exports = app;
