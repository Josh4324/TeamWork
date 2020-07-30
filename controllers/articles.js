const {
  Pool,
  Client,
} = require('pg');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');
const {
  createArticleTable,
  createArticleCommentTable
} = require("../Utils/query");
const {
  errorResMsg,
  successResMsg
} = require("../Utils/response");
const connectionString = process.env.CONNECTION_STRING
const pool = new Pool(connectionString);
const client = new Client(connectionString);
client.connect();



exports.createArticle = (req, res) => {
  client.query((createArticleTable), (err, res) => {
    if (err) {
      return
    }
  });

  const query = 'INSERT INTO articles (user_id,article_id,article,title,category,createdon) VALUES($1,$2,$3,$4,$5,$6) RETURNING *';
  const article_id = uniqid();
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const user_id = decodedToken.userId;
  const createdon = new Date();
  const {
    title,
    article,
    category
  } = req.body;
  const values = [user_id, article_id, article, title, category, createdon];
  pool.query(query, values).then(() => {
      const data = {
        articleId: article_id,
        message: 'Article successfully posted',
        createdOn: createdon,
        title,
      }
      successResMsg(res, 200, data);
    })
    .catch(
      (error) => {
        errorResMsg(res, 500, error);
      },
    );
};

exports.addComment = (req, res) => {
  client.query((createArticleCommentTable), (err, res) => {
    if (err) {
      return
    }
  });
  const {
    article_id
  } = req.params;
  const {
    comment
  } = req.body;
  const query = 'INSERT INTO articleComments (user_id,article_id,comment_id,comment,createdon) VALUES($1,$2,$3,$4,$5) RETURNING *';
  const comment_id = uniqid();
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const user_id = decodedToken.userId;
  const createdon = new Date();
  const values = [user_id, article_id, comment_id, comment, createdon];
  pool.query(query, values).then(() => {
      const data = {
        commentId: comment_id,
        message: 'Comment successfully created',
        createdOn: createdon,
        comment,
      }
      successResMsg(res, 201, data);
    })
    .catch(
      (error) => {
        errorResMsg(res, 500, error);
      },
    );

  client.end();
};

exports.editArticle = (req, res) => {
  const {
    article_id
  } = req.params;
  const {
    article
  } = req.body;
  const query = 'UPDATE articles SET article = ($1) where article_id = ($2)';
  const value = [article, article_id];
  pool.query(query, value).then((result) => {
    const data = {
      message: "article updated successfully",
      article_id: article_id
    }
    successResMsg(res, 201, data);
  }).catch((error) => {
    errorResMsg(res, 500, error);
  })
}


exports.deleteArticle = (req, res) => {
  const {
    article_id
  } = req.params;
  const query = 'DELETE from articles where article_id = $1';
  const value = [article_id];
  pool.query(query, value).then(() => {
      data = {
        message: 'Article successfully deleted'
      }
      successResMsg(res, 200, data);
    })
    .catch(
      (error) => {
        errorResMsg(res, 500, error);
      },
    );
};

exports.getOneArticle = (req, res) => {
  const {
    article_id
  } = req.params;
  const query = 'SELECT * from articles where article_id = $1';
  const query2 = 'SELECT * from articleComments where article_id = $1';
  const value = [article_id];
  let result;
  pool.query(query, value).then((data1) => {
      result = data1.rows;
      pool.query(query2, value).then((data) => {
        const comments = data.rows;
        const results = {
          id: result[0].id,
          user_id: result[0].user_id,
          createdon: result[0].createdon,
          title: result[0].title,
          article: result[0].article,
          comments,
        }
        successResMsg(res, 200, results);
      }).catch((error) => {
        errorResMsg(res, 500, error);
      });
    })
    .catch((error) => {
      errorResMsg(res, 500, error);
    });
};

exports.flagComment = (req, res) => {
  const {
    comment_id
  } = req.params;
  const {
    flag
  } = req.body;
  const query = 'UPDATE articleComments SET flag = ($1) where comment_id = ($2)';
  const value = [flag, comment_id];
  pool.query(query, value).then(() => {
      const data = {
        message: 'flag set successfully'
      }
      successResMsg(res, 201, data);
    })
    .catch(
      (error) => {
        errorResMsg(res, 500, error);
      },
    );
};

exports.flagArticle = (req, res) => {
  const {
    article_id
  } = req.params;
  const {
    flag
  } = req.body;
  const query = 'UPDATE articles SET flag = ($1) where article_id = ($2)';
  const value = [flag, article_id];
  pool.query(query, value).then(() => {
      const data = {
        message: 'flag set successfully'
      }
      successResMsg(res, 201, data);
    })
    .catch(
      (error) => {
        errorResMsg(res, 500, error);
      },
    );
};

exports.deleteFlagArticle = (req, res) => {
  const query = 'DELETE from articles where flag = $1';
  const value = [true];
  pool.query(query, value).then(() => {
      const data = {
        message: 'All flagged articles successfully deleted'
      }
      successResMsg(res, 200, data);
    })
    .catch(
      (error) => {
        errorResMsg(res, 500, error);
      },
    );
};

exports.deleteFlagComment = (req, res) => {
  const query = 'DELETE from articleComments where flag = $1';
  const value = [true];
  pool.query(query, value).then(() => {
      const data = {
        message: 'All flagged articles comments successfully deleted'
      }
      successResMsg(res, 200, data);
    })
    .catch(
      (error) => {
        errorResMsg(res, 500, error);
      },
    );
};