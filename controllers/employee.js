const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    Pool
} = require('pg');
const uniqid = require('uniqid');


const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

const pool = new Pool(config)


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            let text = `INSERT INTO users (user_id, firstName, lastName, email, jobRole, gender, department, address, password) 
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`
            let {
                firstName,
                lastName,
                email,
                jobRole,
                gender,
                department,
                address
            } = req.body
            let user_id = uniqid()
            let values = [user_id, firstName, lastName, email, jobRole, gender, department, address, hash]
            pool.query(text, values).then(
                (result) => {
                    console.log(result)
                    const token = jwt.sign({
                            user_id: user_id,
                            jobRole: jobRole
                        },
                        'RANDOM_TOKEN_SECRET', {
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
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    })
                }
            )
        }
    )
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
                            'RANDOM_TOKEN_SECRET', {
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