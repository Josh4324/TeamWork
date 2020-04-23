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

const pool = new Pool(config)


exports.createArticle = (req, res, next) => {
    let text = 'INSERT INTO articles (user_id,article_id,article,title,createdon) VALUES($1,$2,$3,$4,$5) RETURNING *'
    let article_id = uniqid();
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const user_id = decodedToken.userId;
    let createdon = new Date()
    let title = req.body.title;
    let article = req.body.article;
    let values = [user_id, article_id, article, title, createdon]
    pool.query(text, values).then(() => {
            res.status(201).json({
                status: 'Success',
                data: {
                    "articleId": article_id,
                    "message": "Article successfully posted",
                    "createdOn": createdon,
                    "title": title
                }
            });
        })
        .catch(
            (error) => {
                res.status(500).json({
                    error: error
                });
            }
        )


};

exports.addComment = (req, res, next) => {
    let article_id = req.params.article_id;
    let text = 'INSERT INTO articleComments (user_id,article_id,comment_id,comment,createdon) VALUES($1,$2,$3,$4,$5) RETURNING *'
    let comment_id = uniqid();
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const user_id = decodedToken.userId;
    let createdon = new Date()
    let comment = req.body.comment;
    let values = [user_id, article_id, comment_id, comment, createdon]
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
                    error: error
                });
            }
        )


};

exports.editArticle = (req, res, next) => {
    let article_id = req.params.article_id;
    let text = 'UPDATE articles SET article = ($1) where article_id = ($2)';
    let text2 = 'SELECT * from articles where article_id = $1';
    let value2 = [article_id]
    let article = req.body.article;
    let value = [article, article_id];

    pool.query(text, value).then(() => {
            pool.query(text2, value2).then((result) => {
                let data = result.rows;
                const {
                    article,
                    title
                } = data[0];
                res.status(201).json({
                    status: 'Success',
                    data: {
                        "articleId": article_id,
                        "message": "Article successfully updated",
                        "title": title,
                        "article": article
                    }
                });
            }).catch(
                (error) => {
                    console.log(error)
                    res.status(500).json({
                        error: error
                    });
                }
            )
        })
        .catch(
            (error) => {
                console.log(error)
                res.status(500).json({
                    error: error
                });
            }
        )
};

exports.deleteArticle = (req, res, next) => {
    let article_id = req.params.article_id;
    let text = 'DELETE from articles where article_id = $1';
    let value = [article_id];
    pool.query(text, value).then(() => {
            res.status(200).json({
                status: 'Success',
                data: {
                    "message": "Article successfully deleted",
                }
            });
        })
        .catch(
            (error) => {
                console.log(error)
                res.status(500).json({
                    error: error
                });
            }
        )
};