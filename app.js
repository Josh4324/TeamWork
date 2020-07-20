const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRouter = require('./routes/employee');
const feedRouter = require('./routes/feed');
const gifsRouter = require('./routes/gifs');
const articlesRouter = require('./routes/articles');


const app = express();
const port = process.env.PORT || 4000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use('/api/auth', userRouter);
app.use('/api/feed', feedRouter);
app.use('/api/gifs', gifsRouter);
app.use('/api/articles', articlesRouter);


app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});


app.server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Running on port ${port}`);
});


module.exports = app;
