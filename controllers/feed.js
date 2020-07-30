const {
    Pool
} = require('pg');
const {
    errorResMsg,
    successResMsg
} = require('../Utils/response')
const {
    compare,
} = require('../Utils/helper');
const connectionString = process.env.CONNECTION_STRING

const pool = new Pool(connectionString);


exports.getAllArticlesAndGifs = (req, res) => {
    const category = req.query.category;
    const query = 'SELECT * FROM gifs';
    const query2 = 'SELECT * FROM articles';
    let data
    pool.query(query).then((gifs) => {
            pool.query(query2).then((articles) => {
                    data = [...gifs.rows, ...articles.rows];
                    data.sort(compare);
                    if (category) {
                        data = data.filter((item) => {
                            return item.category === category
                        })
                    }
                    successResMsg(res, 200, data);
                })
                .catch((error) => {
                    errorResMsg(res, 500, error);
                });

        })
        .catch((error) => {
            errorResMsg(res, 500, error);
        });
};

exports.getGifComments = (req, res) => {
    const {
        gif_id
    } = req.params;
    const value = [gif_id];
    let results
    const query = 'Select * from gifComments where gif_id = $1';
    pool.query(query, value).then((comments) => {
        results = comments.rows;
        successResMsg(res, 200, results)
    }).catch((error) => {
        errorResMsg(res, 500, error)
    });

}

exports.getArticleComments = (req, res) => {
    let results;
    const {
        article_id
    } = req.params;
    const query = 'Select * from articleComments where article_id = $1';
    const value = [article_id];
    pool.query(query, value).then((comments) => {
        results = comments.rows;
        successResMsg(res, 200, results)
    }).catch((error) => {
        errorResMsg(res, 500, error)
    });
}