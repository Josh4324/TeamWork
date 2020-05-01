const {
    Pool,
    Client
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
const client = new Client(config);
client.connect();

const createArticleTable = `
CREATE TABLE IF NOT EXISTS articles (
    id serial primary key,
	user_id text not null ,
	article_id text not null unique,
	article text not null,
    title text not null,
    category text,
    flag boolean,
	createdOn TIMESTAMP not null
);
`

const createArticleCommentTable = `
CREATE TABLE IF NOT EXISTS articleComments (
    id serial primary key,
	user_id text not null,
	article_id text not null,
	comment_id text not null unique,
    comment text not null,
    flag boolean,
	createdOn TIMESTAMP not null
);
`


exports.createArticle = (req, res, next) => {
    client.query((createArticleTable), (err, res) => {
        if (err) {
            return;
        }
    });

    let text = 'INSERT INTO articles (user_id,article_id,article,title,category,createdon) VALUES($1,$2,$3,$4,$5,$6) RETURNING *'
    let article_id = uniqid();
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, secret);
    const user_id = decodedToken.userId;
    let createdon = new Date()
    let title = req.body.title;
    let article = req.body.article;
    let category = req.body.category;
    let values = [user_id, article_id, article, title, category, createdon]
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
    client.query((createArticleCommentTable), (err, res) => {
        if (err) {
            return;
        }
    });
    let article_id = req.params.article_id;
    let text = 'INSERT INTO articleComments (user_id,article_id,comment_id,comment,createdon) VALUES($1,$2,$3,$4,$5) RETURNING *'
    let comment_id = uniqid();
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, secret);
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

    client.end();
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

exports.getOneArticle = (req, res, next) => {
    let article_id = req.params.article_id;
    let text = 'SELECT * from articles where article_id = $1';
    let text2 = 'SELECT * from articleComments where article_id = $1'
    let value = [article_id];
    let result;
    pool.query(text, value).then((data1) => {
            result = data1.rows;
            pool.query(text2, value).then((data) => {
                let comments = data.rows;
                res.status(200).json({
                    status: 'Success',
                    data: {
                        "id": result[0].id,
                        "user_id": result[0].user_id,
                        "createdon": result[0].createdon,
                        "title": result[0].title,
                        "article": result[0].article,
                        "comments": comments
                    }
                })
            })
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            });
        });
};

exports.flagComment = (req, res, next) => {
    let comment_id = req.params.comment_id;
    let text = 'UPDATE articleComments SET flag = ($1) where comment_id = ($2)';
    let flag = req.body.flag;
    let value = [flag, comment_id];

    pool.query(text, value).then(() => {
            res.status(201).json({
                status: 'Success',
                data: {
                    "message": "flag set successfully",
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

exports.flagArticle = (req, res, next) => {
    let article_id = req.params.article_id;
    let text = 'UPDATE articles SET flag = ($1) where article_id = ($2)';
    let flag = req.body.flag;
    let value = [flag, article_id];

    pool.query(text, value).then(() => {
            res.status(201).json({
                status: 'Success',
                data: {
                    "message": "flag set successfully",
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

exports.deleteFlagArticle = (req, res, next) => {
    const text = 'DELETE from articles where flag = $1';
    const value = [true];
    pool.query(text, value).then(() => {
            res.status(200).json({
                status: 'Success',
                data: {
                    message: 'All flagged articles successfully deleted',
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

exports.deleteFlagComment = (req, res, next) => {
    const text = 'DELETE from articleComments where flag = $1';
    const value = [true];
    pool.query(text, value).then(() => {
            res.status(200).json({
                status: 'Success',
                data: {
                    message: 'All flagged articles comments successfully deleted',
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