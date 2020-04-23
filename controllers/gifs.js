const cloudinary = require('cloudinary').v2;
const {
  Pool,
} = require('pg');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

const pool = new Pool(config);


exports.createGif = (req, res, next) => {
  const text = 'INSERT INTO gifs (user_id,gif_id,gif_url,title,createdon) VALUES($1,$2,$3,$4,$5) RETURNING *';
  let gif_url;
  const gif_id = uniqid();
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const user_id = decodedToken.userId;
  cloudinary.uploader.upload(req.body.gif_url, (error, result) => {
    if (result) {
      gif_url = result.secure_url;
      const createdon = new Date();
      console.log(gif_id);
      const {
        title
      } = req.body;
      console.log(user_id);
      const values = [user_id, gif_id, gif_url, title, createdon];
      pool.query(text, values).then(() => {
          res.status(201).json({
            status: 'Success',
            data: {
              gifId: gif_id,
              message: 'GIF image successfully posted',
              createdOn: createdon,
              title,
              imageUrl: gif_url,
            },
          });
        })
        .catch(
          (error) => {
            res.status(500).json({
              error,
            });
          },
        );
    } else {
      res.status(500).json({
        error,
      });
    }
  });
};


exports.addComment = (req, res, next) => {
  const {
    gif_id
  } = req.params;
  const text = 'INSERT INTO gifComments (user_id,gif_id,comment_id,comment,createdon) VALUES($1,$2,$3,$4,$5) RETURNING *';
  const comment_id = uniqid();
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const user_id = decodedToken.userId;
  const createdon = new Date();
  const {
    comment
  } = req.body;
  const values = [user_id, gif_id, comment_id, comment, createdon];
  pool.query(text, values).then(() => {
      res.status(201).json({
        status: 'Success',
        data: {
          "commentId": comment_id,
          "message": "Comment successfully created",
          "createdOn": createdon,
          "comment": comment
        }
      });
    })
    .catch(
      (error) => {
        res.status(500).json({
          error,
        });
      },
    );
};


exports.getAllGif = (req, res, next) => {
  const text = 'SELECT * FROM gifs';
  pool.query(text).then((gifs) => {
      results = gifs.rows;
      res.status(200).json({
        status: 'Success',
        data: results,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error,
      });
    });
};

exports.deleteGif = (req, res, next) => {
  const {
    gif_id
  } = req.params;
  const text = 'DELETE from gifs where gif_id = $1';
  const value = [gif_id];
  pool.query(text, value).then(() => {
      res.status(200).json({
        status: 'Success',
        data: {
          message: 'Gif post successfully deleted',
        },
      });
    })
    .catch(
      (error) => {
        console.log(error);
        res.status(500).json({
          error,
        });
      },
    );
};