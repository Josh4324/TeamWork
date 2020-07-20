const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const token = "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MnQ5amN1b2s5ZDBiNDFnIiwiam9iUm9sZSI6ImFkbWluIiwiaWF0IjoxNTg4Mzc1MjcyLCJleHAiOjE1ODg0NjE2NzJ9.ovPC3QFiNNW6afCBNpeFQ0UBZACjtf3OSfznHY823XU"


chai.use(chaiHttp);

describe("Articles Controller Test", () => {
    describe("Post Article", () => {
        it("should post an article when all required parameters are sent", (done) => {
            const data = {
                "title": "Article",
                "article": "New Article",
            }
            chai.request(app)
                .post('/api/articles')
                .set("Authorization", token)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.status.should.equal('Success')
                    done();
                })

        })

        it("should not post an article without the required parameters", (done) => {
            const data = {
                "title": "Article",
                "article": "",
            }
            chai.request(app)
                .post('/api/articles')
                .set("Authorization", token)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    done();
                })

        })
    })

    describe("Edit Article", () => {
        it("should be able to edit article when all required fields are sent", (done) => {
            const data = {
                "article": "Updated Article",
            }
            chai.request(app)
                .patch('/api/articles/52t9jag0k9ow51rv')
                .set("Authorization", token)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.data.message.should.equal("Article successfully updated");
                    done();
                })

        })

        it("should be not able to edit article when all required fields are not sent", (done) => {
            const data = {
                "article": "",
            }
            chai.request(app)
                .patch('/api/articles/52t9jag0k9ow51rv')
                .set("Authorization", token)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    done();
                })

        })
    })

    describe("Get One Article", () => {
        it("should be able to get the requested article when given a correct article_id", (done) => {
            chai.request(app)
                .get('/api/articles/52t9jag0k9ow51rv')
                .set("Authorization", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('article');
                    res.body.data.should.have.property('title');
                    done();
                })

        })

        it("should not be able to get the requested article when given a wrong article_id", (done) => {
            chai.request(app)
                .get('/api/articles/52t9jag0k9ow51r3')
                .set("Authorization", token)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    done();
                })

        })
    })
})