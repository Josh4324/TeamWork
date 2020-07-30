const cloudinary = require("cloudinary").v2;
const {
  Pool,
  Client
} = require("pg");
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");
const {
  cloudinaryConfig,
} = require("../Utils/helper");
const {
  createGifTable,
  createGifCommentTable
} = require("../Utils/query");
const {
  errorResMsg,
  successResMsg
} = require("../Utils/response");
const connectionString = process.env.CONNECTION_STRING

cloudinary.config(cloudinaryConfig);

const pool = new Pool( connectionString);
const client = new Client( connectionString);
client.connect();

exports.createGif = (req, res) => {
  client.query(createGifTable, (err, res) => {
    if (err) {
      return;
    }
  });
  const query =
    "INSERT INTO gifs (user_id,gif_id,gif_url,title,category,createdon) VALUES($1,$2,$3,$4,$5,$6) RETURNING *";
  let gif_url;
  const gif_id = uniqid();
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const user_id = decodedToken.userId;
  cloudinary.uploader.upload(req.body.gif_url, (error, result) => {
    if (result) {
      gif_url = result.secure_url;
      const createdon = new Date();
      const {
        title,
        category
      } = req.body;
      const values = [user_id, gif_id, gif_url, title, category, createdon];
      pool
        .query(query, values)
        .then(() => {
          const data = {
            gifId: gif_id,
            message: "GIF image successfully posted",
            createdOn: createdon,
            title,
            imageUrl: gif_url,
          };
          successResMsg(res, 201, data);
        })
        .catch((error) => {
          errorResMsg(res, 500, error);
        });
    } else {
      errorResMsg(res, 500, error);
    }
  });
};

exports.addComment = (req, res) => {
  client.query(createGifCommentTable, (err, res) => {
    if (err) {
      return;
    }
  });
  const {
    gif_id
  } = req.params;
  const {
    comment
  } = req.body;
  const query =
    "INSERT INTO gifComments (user_id,gif_id,comment_id,comment,createdon) VALUES($1,$2,$3,$4,$5) RETURNING *";
  const comment_id = uniqid();
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.SECRET);
  const user_id = decodedToken.userId;
  const createdon = new Date();
  const values = [user_id, gif_id, comment_id, comment, createdon];
  pool
    .query(query, values)
    .then(() => {
      const data = {
        commentId: comment_id,
        message: "Comment successfully created",
        createdOn: createdon,
        comment: comment,
      };
      successResMsg(res, 201, data);
    })
    .catch((error) => {
      errorResMsg(res, 500, error);
    });
};

exports.deleteGif = (req, res) => {
  const {
    gif_id
  } = req.params;
  const query = "DELETE from gifs where gif_id = $1";
  const value = [gif_id];
  pool
    .query(query, value)
    .then(() => {
      const data = {
        message: "Gif post successfully deleted",
      };
      successResMsg(res, 200, data);
    })
    .catch((error) => {
      errorResMsg(res, 500, error);
    });
};

exports.getOneGif = (req, res) => {
  const {
    gif_id
  } = req.params;
  let query = "SELECT * from gifs where gif_id = $1";
  let query2 = "SELECT * from gifComments where gif_id = $1";
  let value = [gif_id];
  let result;
  pool
    .query(query, value)
    .then((result) => {
      result = result.rows;
      pool.query(query2, value).then((data) => {
        let comments = data.rows;
        data = {
          id: result[0].id,
          user_id: result[0].user_id,
          createdon: result[0].createdon,
          title: result[0].title,
          url: result[0].gif_url,
          comments: comments,
        };
        successResMsg(res, 200, data);
      });
    })
    .catch((error) => {
      errorResMsg(res, 500, error);
    });
};

exports.flagComment = (req, res) => {
  let comment_id = req.params.comment_id;
  let query = "UPDATE gifComments SET flag = ($1) where comment_id = ($2)";
  let flag = req.body.flag;
  let value = [flag, comment_id];

  pool
    .query(query, value)
    .then(() => {
      const data = {
        message: "flag set successfully",
      };
      successResMsg(res, 200, data);
    })
    .catch((error) => {
      errorResMsg(res, 500, error);
    });
};

exports.flagGif = (req, res) => {
  let gif_id = req.params.gif_id;
  let query = "UPDATE gifs SET flag = ($1) where gif_id = ($2)";
  let flag = req.body.flag;
  let value = [flag, gif_id];

  pool
    .query(query, value)
    .then(() => {
      const data = {
        message: "flag set successfully",
      };
      successResMsg(res, 200, data);
    })
    .catch((error) => {
      errorResMsg(res, 500, error);
    });
};

exports.deleteFlagComment = (req, res) => {
  const query = "DELETE from gifComments where flag = $1";
  const value = [true];
  pool
    .query(query, value)
    .then(() => {
      data = {
        message: "All flagged Gifs comments successfully deleted",
      };
      successResMsg(res, 200, data);
    })
    .catch((error) => {
      errorResMsg(res, 500, error);
    });
};

exports.deleteFlagGif = (req, res) => {
  const query = "DELETE from gifs where flag = $1";
  const value = [true];
  pool
    .query(query, value)
    .then(() => {
      data = {
        message: "All flagged Gifs successfully deleted",
      };
      successResMsg(res, 200, data);
    })
    .catch((error) => {
      errorResMsg(res, 500, error);
    });
};