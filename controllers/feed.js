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
const compare = (a, b) => {
    const time1 = a.createdon.getTime();
    const time2 = b.createdon.getTime();

    let comparison = 0;
    if (time1 > time2) {
        comparison = 1;
    } else if (time1 < time2) {
        comparison = -1;
    }
    return comparison * -1;
}


exports.getAllArticlesAndGifs = (req, res, next) => {
    const category = req.query.category;
    const text = 'SELECT * FROM gifs INNER JOIN  gifComments ON gifs.gif_id = gifComments.gif_id';
    const text2 = 'SELECT * FROM articles INNER JOIN articleComments ON articles.article_id = articleComments.article_id';
    let results1, results2, allresult, newresult
    pool.query(text).then((gifs) => {
            results1 = gifs.rows;
            pool.query(text2).then((articles) => {
                    results2 = articles.rows;
                    allresult = [...results1, ...results2];
                    allresult.sort(compare);
                    if (category) {
                        newresult = allresult.filter((item) => {
                            return item.category === category
                        })
                    } else {
                        newresult = allresult
                    }

                    res.status(200).json({
                        status: 'Success',
                        data: newresult,
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
                error: error
            });
        });
};