const chaiHttp = require("chai-http");
const chai = require("chai");
let assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("Convert Valid and Invalid Input", () => {
    // #1
    test("Valid input 10L: GET /api/convert", (done) => {
      chai
        .request(server)
        .get("/api/convert")
        .query({ input: "10L" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.initNum, 10);
          assert.equal(res.body.initUnit, "L");
          assert.equal(res.body.returnNum, 2.64172);
          assert.equal(res.body.returnUnit, "gal");
          done();
        });
    });

    // #2
    test("Invalid input 32g: GET /api/convert", (done) => {
      chai
        .request(server)
        .get("/api/convert")
        .query({ input: "32g" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, "invalid unit");
        });
      done();
    });

    // #3
    test("Invalid number 3/7.2/4kg: GET /api/convert", (done) => {
      chai
        .request(server)
        .get("/api/convert")
        .query({ input: " 3/7.2/4kg" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, "invalid number");
        });
      done();
    });

    // #4
    test("Invalid number AND unit 3/7.2/4kilomegagram: GET /api/convert", (done) => {
      chai
        .request(server)
        .get("/api/convert")
        .query({ input: "3/7.2/4kilomegagram" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, "invalid number and unit");
        });
      done();
    });

    // #5
    test("With no number kg: GET /api/convert", (done) => {
      chai
        .request(server)
        .get("/api/convert")
        .query({ input: "kg" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.initNum, 1);
          assert.equal(res.body.initUnit, "kg");
          assert.equal(res.body.returnNum, 2.20462);
          assert.equal(res.body.returnUnit, "lbs");
        });
      done();
    });
  });
});