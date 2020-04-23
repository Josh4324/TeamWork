const {
    Pool
} = require('pg');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

const pool = new Pool(config);


exports.getAllArticlesAndGifs = (req, res, next) => {
    const text = 'SELECT * FROM gifs';
    const text2 = 'SELECT * FROM articles';
    let result1, result2, allresult
    pool.query(text).then((gifs) => {
            results1 = gifs.rows;
            pool.query(text2).then((articles) => {
                    results2 = articles.rows;
                    allresult = [...results1, ...results2]
                    let time = allresult[0].createdon
                    let h = time.getHours()
                    let m = time.getMinutes()
                    let s = time.getSeconds()
                    console.log("time", h, m, s);
                    res.status(200).json({
                        status: 'Success',
                        data: allresult,
                    })
                })
                .catch((error) => {
                    res.status(500).json({
                        error,
                    });
                });

        })
        .catch((error) => {
            res.status(500).json({
                error,
            });
        });
};