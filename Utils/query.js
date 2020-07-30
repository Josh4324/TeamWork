const createGifTable = `
CREATE TABLE IF NOT EXISTS gifs (
  id serial primary key,
	user_id text not null ,
	gif_id text not null unique,
	gif_url text not null,
  title text not null,
  category text,
  flag boolean,
	createdOn TIMESTAMP not null
);
`
const createGifCommentTable = `
CREATE TABLE IF NOT EXISTS gifComments (
  id serial primary key,
	user_id text not null,
	gif_id text not null,
	comment_id text not null unique,
  comment text not null,
  flag boolean,
	createdOn TIMESTAMP not null
);
`
const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  id serial primary key,
  user_id text not null unique,
  firstName text not null,
  lastName text not null,
  email text not null,
  jobRole text not null,
  gender text not null,
  department text not null,
  address text not null,
  password text not null,
  createdOn TIMESTAMP not null
);
`

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

module.exports.createGifTable = createGifTable;
module.exports.createGifCommentTable = createGifCommentTable;
module.exports.createUserTable = createUserTable;
module.exports.createArticleTable = createArticleTable;
module.exports.createArticleCommentTable = createArticleCommentTable;