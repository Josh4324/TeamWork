const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    Pool,
    Client
} = require('pg');
const uniqid = require('uniqid');


const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    secret: process.env.SECRET
};

const pool = new Pool(config);
const client = new Client(config);
client.connect()

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


exports.signup = (req, res, next) => {
    client.query((createUserTable), (err, res) => {
        if (err) {
            return;
        }
    });
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            let text = `INSERT INTO users (user_id, firstName, lastName, email, jobRole, gender, department, address, password,createdon) 
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10) RETURNING *`;
            const text1 = 'SELECT email from users where email = $1';
            let {
                firstName,
                lastName,
                email,
                jobRole,
                gender,
                department,
                address
            } = req.body
            let createdon = new Date()
            let user_id = uniqid()
            let values = [user_id, firstName, lastName, email, jobRole, gender, department, address, hash, createdon];
            let value1 = [req.body.email];
            pool.query(text1, value1).then((user) => {
                    if (user.rows.length !== 0) {
                        return res.status(423).json({
                            status: "success",
                            data: {
                                "message": "User already exists",
                            }
                        });
                    } else {

                        pool.query(text, values).then(
                            (result) => {
                                const token = jwt.sign({
                                        user_id: user_id,
                                        jobRole: jobRole
                                    },
                                    secret, {
                                        expiresIn: '24h'
                                    });
                                res.status(201).json({
                                    status: "success",
                                    data: {
                                        "message": "User account successfully created",
                                        "token": token,
                                        "userId": user_id
                                    }
                                });
                            }
                        )

                    }
                })
                .catch(
                    (error) => {
                        res.status(500).json({
                            error: error
                        })
                    }
                )
        }
    )
    client.end();
};


exports.login = (req, res, next) => {
    let text = 'SELECT * from users where email = $1'
    let value = [req.body.email]
    pool.query(text, value)
        .then(
            (user) => {

                if (user.rows.length === 0) {
                    return res.status(401).json({
                        error: "User not found!"
                    });
                }
                bcrypt.compare(req.body.password, user.rows[0].password).then(
                    (valid) => {
                        console.log(valid)
                        if (!valid) {
                            return res.status(401).json({
                                error: 'Incorrect password!'
                            });
                        }
                        let {
                            user_id,
                            jobrole
                        } = user.rows[0]

                        const token = jwt.sign({
                                userId: user_id,
                                jobRole: jobrole
                            },
                            secret, {
                                expiresIn: '24h'
                            });

                        res.status(200).json({
                            status: "success",
                            data: {
                                "token": token,
                                "userId": user_id
                            }
                        })
                    }
                ).catch(
                    (error) => {
                        res.status(500).json({
                            error: error
                        });
                    }
                );
            }
        );
};