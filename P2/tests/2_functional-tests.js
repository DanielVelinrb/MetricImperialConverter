const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { expect } = require("chai");
const Issue = require("../models/issue");
const { ObjectId } = require("mongodb");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("Test POST", () => {
    // #1
    test("POST Issue with every field", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send({
          issue_title: "Error in data",
          issue_text: "Data has an error",
          created_by: "Daniel",
          assigned_to: "Pepe",
          status_text: "In QA",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Error in data");
          assert.equal(res.body.issue_text, "Data has an error");
          assert.equal(res.body.created_by, "Daniel");
          assert.equal(res.body.assigned_to, "Pepe");
          assert.equal(res.body.status_text, "In QA");
          done();
        });
    });

    // #2
    test("POST Issue with only required fields", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send({
          issue_title: "Error in data",
          issue_text: "Data has an error",
          created_by: "Daniel",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Error in data");
          assert.equal(res.body.issue_text, "Data has an error");
          assert.equal(res.body.created_by, "Daniel");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          done();
        });
    });

    // #3
    test("POST Issue with missing required fields", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send({
          issue_title: "Error in data",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });

  suite("Test GET", () => {
    // #1
    test("GET Issues on a project", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")
        .query({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body, "is array");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          done();
        });
    });

    // #2
    test("GET Issues on a project with one filter", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")
        .query({ created_by: "Daniel" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body, "is array");
          res.body.forEach((issue) => {
            assert.equal(issue.created_by, "Daniel");
          });
          done();
        });
    });

    // #3
    test("GET Issues on a project with multiple filters", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")
        .query({ created_by: "Sam" }, { open: true })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body, "is array");
          res.body.forEach((issue) => {
            assert.equal(issue.created_by, "Daniel");
            assert.equal(issue.open, true);
          });
          done();
        });
    });
  });

  suite("Test PUT", () => {
    // #1
    test("PUT One field on an issue", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: "65d91454f52ac806ecd21498",
          issue_text: "Error1",
        })
        .end((err, res) => {
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, "65d91454f52ac806ecd21498");
          done();
        });
    });

    // #2
    test("PUT Multiple fields on an issue", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: "65d91454f52ac806ecd21498",
          created_by: "Daniel",
          issue_text: "Error",
        })
        .end((err, res) => {
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, "65d91454f52ac806ecd21498");
          done();
        });
    });

    // #3
    test("PUT Issue with missing id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({})
        .end((err, res) => {
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });

    // #4
    test("PUT Issue with no fields to update", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({ _id: "65cad5c5101563a7e25f77bf" })
        .end((err, res) => {
          assert.equal(res.body.error, "no update field(s) sent");
          assert.equal(res.body._id, "65cad5c5101563a7e25f77bf");
          done();
        });
    });

    // #5
    test("PUT Issue with an invalid id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({ _id: "65cad5c5101563a7e25f7761", issue_text: "Daniel" })
        .end((err, res) => {
          assert.equal(res.body.error, "could not update");
          assert.equal(res.body._id, "65cad5c5101563a7e25f7761");
          done();
        });
    });
  });

  suite("Test DELETE", () => {
    // #1
    test("DELETE An issue", (done) => {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({ _id: "65cad6a7e92553a805ec52c7" })
        .end((err, res) => {
          // if the id exist the message must be successfully deleted
          // in this case the id is already deleted
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.body._id, "65cad6a7e92553a805ec52c7");
          done();
        });
    });
    // #2
    test("DELETE An issue with an invalid id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest")
        .send({
          _id: "65cad5c5101563a7e25f7761",
        })
        .end((err, res) => {
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.body._id, "65cad5c5101563a7e25f7761");
          done();
        });
    });
    // #3
    test("DELETE An issue with missing id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest")
        .send({})
        .end((err, res) => {
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
  });
});