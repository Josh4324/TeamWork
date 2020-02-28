const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()

const userRouter = require('./routes/employee');
const gifsRouter = require('./routes/gifs');

const app = express();
const port = process.env.PORT || 4000;

console.log(process.env)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/auth', userRouter);
app.use("/api/gif", gifsRouter);


app.get('/', (req, res) => {
    res.send('Welcome to my API!');
  });


app.server = app.listen(port, () => {
    console.log(`Running on port ${port}`);
});