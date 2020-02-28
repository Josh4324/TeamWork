const cloudinary = require('cloudinary').v2;
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
  });

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  };

const pool = new Pool (config)


exports.createGif = (req, res, next) => {
    let text = 'INSERT INTO gifs (user_id,gif_id,gif_name) VALUES($1,$2,$3) RETURNING *'
    let gif_name;
    let gif_id = uniqid()

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const user_id = decodedToken.user_id;

    cloudinary.uploader.upload(req.body.gif_name, function(error, result) {
        if (result) {
            gif_name = result.secure_url
            console.log(gif_name)
            let values = [user_id,gif_id,gif_name]
            pool.query(text, values).then(() => {
                res.status(201).json({
                    status: 'Success'
                })
            })
            .catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            )
        }else {
            res.status(500).json({
                error: error
            });
        }
        
    });
 };