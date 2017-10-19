import {expect} from "chai";
import request from "request";
import dotenv from "dotenv";

dotenv.config();
describe("Login", () => {
    describe("Successful login", () => {
        let data = {
            username: process.env.KNOWN_USERNAME,
            password: process.env.KNOWN_PWD
        };
        let options = {
            method: "POST",
            body: data,
            json: true,
            url: "http://localhost:8000/api/authenticate"
        };

        it("should return 200 OK", (done) => {
            request(options, (err, res) => {
                if (err) throw err;

                expect(res.statusCode).to.equal(200);
                done();
            });
        });

        it("should have the required fields", (done) => {
            request(options, (err, res, body) => {
                if (err) throw err;

                expect(body).to.have.property("success");
                expect(body.success).to.equal(true);

                expect(body).to.have.property("user");
                expect(body).to.have.property("message");
                expect(body).to.have.property("token");

                expect(body.user).to.have.property("name");
                expect(body.user).to.have.property("username");
                expect(body.user).to.have.property("dp");

                done();
            });
        });
    });

    describe()
});
