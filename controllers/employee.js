const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    Pool,
    Client
} = require('pg');
const uniqid = require('uniqid');
const {
    createUserTable
} = require("../Utils/query");
const connectionString = process.env.CONNECTION_STRING
const pool = new Pool(connectionString);
const client = new Client(connectionString);
client.connect()
const {
    errorResMsg,
    successResMsg
} = require("../Utils/response");



exports.signup = (req, res) => {
    let {
        firstName,
        lastName,
        email,
        jobRole,
        gender,
        department,
        address
    } = req.body
    let query = `INSERT INTO users (user_id, firstName, lastName, email, jobRole, gender, department, address, password,createdon) 
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,$10) RETURNING *`;
    const query1 = 'SELECT email from users where email = $1';
    let createdon = new Date()
    let user_id = uniqid()
    let value1 = [req.body.email];
    client.query((createUserTable), (err, res) => {
        if (err) {
            return;
        }
    });
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            let values = [user_id, firstName, lastName, email, jobRole, gender, department, address, hash, createdon];
            pool.query(query1, value1).then((user) => {
                    if (user.rows.length !== 0) {
                        const data = {
                            "message": "User already exists",
                        }
                        successResMsg(res, 423, data);
                    } else {
                        pool.query(query, values).then(() => {
                            const token = jwt.sign({
                                    user_id: user_id,
                                    jobRole: jobRole
                                },
                                process.env.SECRET, {
                                    expiresIn: '24h'
                                });
                            const data = {
                                "message": "User account successfully created",
                                "token": token,
                                "userId": user_id
                            }
                            successResMsg(res, 200, data);
                        })

                    }
                })
                .catch((error) => {
                    errorResMsg(res, 500, error);
                })
        }
    )
    client.end();
};


exports.login = (req, res) => {
    let query = 'SELECT * from users where email = $1'
    let value = [req.body.email]
    pool.query(query, value)
        .then((user) => {
            if (user.rows.length === 0) {
                const error = {
                    error: "User not found!"
                }
                errorResMsg(res, 401, error);
            }
            bcrypt.compare(req.body.password, user.rows[0].password).then(
                (valid) => {
                    if (!valid) {
                        const error = {
                            error: 'Incorrect password!'
                        }
                        errorResMsg(res, 401, error);
                    }
                    let {
                        user_id,
                        jobrole
                    } = user.rows[0]

                    const token = jwt.sign({
                            userId: user_id,
                            jobRole: jobrole
                        },
                        process.env.SECRET, {
                            expiresIn: '24h'
                        });
                    const data = {
                        "token": token,
                        "userId": user_id
                    }
                    successResMsg(res, 200, data);
                }
            ).catch((error) => {
                errorResMsg(res, 500, error);
            });
        });
};