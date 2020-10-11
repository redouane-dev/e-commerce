const mongoose = require('mongoose');
require('../models/users');

const Users = mongoose.model('Users');

describe("Users database model", () => {
    describe("Users create", () => {
        const user = new Users({
            email: "email@example.com",
        });

        it("should create a user instance and set its password", () => {
            const password = "p4ssw0rd";
            user.setPassword(password);

            expect(user).toHaveProperty('salt');
            expect(user).toHaveProperty('hash');
        });
    });
});