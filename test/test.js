const { expect } = require("chai");
const request = require("supertest");

const app = require("../app");

describe("JSON patch", () => {
  const loginDetails = {
    username: "roshan",
    password: "roshan123",
  };

  let token;

  const imageUrl =
    "https://images-na.ssl-images-amazon.com/images/I/71hn7-p46%2BL._SL1500_.jpg";
  const inValidImageUrl =
    "https://images-na.ssl-images-amazon.com/images/I/510K04sWKnL._SX355";
  const jsonObject =
    '{ "user": { "firstName": "vaibhav", "lastName": "bhuvad" } }';
  const jsonPatchObject =
    '[{"op": "replace", "path": "/user/firstName", "value": "Nikhil"}, {"op": "replace", "path": "/user/lastName", "value": "medappa"}]';

  describe("User Authentication", () => {
    it("it should not log user in if username and password do not meet requirements", (done) => {
      request
        .agent(app)
        .post("/api/users/login")
        .send({
          username: "vaibhav",
          password: "",
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
        });
      done();
    });

    it("it should accept a username/password and return a signed JWT", (done) => {
      request
        .agent(app)
        .post("/api/users/login")
        .send(loginDetails)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.authorized).to.equal(true);
          token = res.body.token;
          done();
        });
    });
  });

  describe("Image Thumbnail Creation", () => {
    it("it should accept a public image url and return a resized image", (done) => {
      request
        .agent(app)
        .post("/api/create-thumbnail")
        .set("token", token)
        .send({
          imageUrl:
            "https://images-na.ssl-images-amazon.com/images/I/71hn7-p46%2BL._SL1500_.jpg",
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.converted).to.equal(true);
          expect(res.statusCode).to.equal(200);
          expect(res.body.converted).to.equal(true);
        });
      done();
    });

    it("it should not process image if token is invalid", (done) => {
      request
        .agent(app)
        .post("/api/create-thumbnail")
        .set("token", "randomewwrongtoken")
        .send({ imageUrl })
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body.authorized).to.equal(false);
        });
      done();
    });

    it("it should not process image if token is not available", (done) => {
      request
        .agent(app)
        .post("/api/create-thumbnail")
        .set("token", "")
        .send({
          imageUrl,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body.authorized).to.equal(false);
        });
      done();
    });
    it("it should not process image if url is invalid", (done) => {
      request
        .agent(app)
        .post("/api/create-thumbnail")
        .set("token", token)
        .send({
          imageUrl: "invalidImageUrl",
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400);
        });
      done();
    });
  });

  describe("Patch object", () => {
    it("it should patch object A with object B", (done) => {
      request
        .agent(app)
        .patch("/api/patch-object")
        .set("token", token)
        .send({
          jsonObject,
          jsonPatchObject,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it("it should not patch if token is invalid", (done) => {
      request
        .agent(app)
        .patch("/api/patch-object")
        .set("token", "randomewwrongtoken")
        .send({
          jsonObject,
          jsonPatchObject,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body.authorized).to.equal(false);
        });
      done();
    });

    it("it should not patch if token is not available", (done) => {
      request
        .agent(app)
        .patch("/api/patch-object")
        .set("token", "")
        .send({
          jsonObject,
          jsonPatchObject,
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          expect(res.body.authorized).to.equal(false);
        });
      done();
    });
  });
});
