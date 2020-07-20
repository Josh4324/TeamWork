const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const token = "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MnQ5amN1b2s5ZDBiNDFnIiwiam9iUm9sZSI6ImFkbWluIiwiaWF0IjoxNTg4Mzc1MjcyLCJleHAiOjE1ODg0NjE2NzJ9.ovPC3QFiNNW6afCBNpeFQ0UBZACjtf3OSfznHY823XU"


chai.use(chaiHttp);

describe("Employer Controller Test", () => {
    describe("SignUp", () => {

        it("should not allow any empty fields on signup", (done) => {
            const data = {
                "firstName": "Josh",
                "lastName": "Adedayo",
                "email": "",
                "password": "jesus000",
                "jobRole": "user",
                "gender": "male",
                "department": "Tech",
                "address": "No 2 agege"
            }

            chai.request(app)
                .post('/api/auth/create-user')
                .set("Authorization", token)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                })
        })

        it("should not allow invalid email", (done) => {
            const data = {
                "firstName": "Josh",
                "lastName": "Adedayo",
                "email": "bayo.com",
                "password": "jesus000",
                "jobRole": "user",
                "gender": "male",
                "department": "Tech",
                "address": "No 2 agege"
            }

            chai.request(app)
                .post('/api/auth/create-user')
                .set("Authorization", token)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    done();
                })
        })

    })


    describe("Login", () => {
        it("should be able to login with appropriate email and password", (done) => {
            const data = {
                "email": "adesanyar@ymail.com",
                "password": "jesus000",
            }

            chai.request(app)
                .post('/api/auth/signin')
                .set("Authorization", token)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        })

        it("should not be able to login with wrong email or password", (done) => {
            const data = {
                "email": "josh@ymail.com",
                "password": "jesus000",
            }

            chai.request(app)
                .post('/api/auth/signin')
                .set("Authorization", token)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    done();
                })
        })


    })

})