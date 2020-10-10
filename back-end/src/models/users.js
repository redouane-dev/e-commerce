const { readFileSync } = require('fs');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Read the private key used to sign tokens
const SECRET = readFileSync('./private.key', 'utf-8');

// Define users schema
const UsersSchema = mongoose.Schema({
    email: String,
    hash: String,
    salt: String,
});

UsersSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.scryptSync(password, this.salt, 512).toString('hex');
};

UsersSchema.methods.validatePassword = function(password) {
    const hash = crypto.scryptSync(password, this.salt, 512).toString('hex');
    return hash === this.hash;
};

UsersSchema.methods.generateJWT = function() {
    const tokenExpirationDays = process.env.TOKEN_EXPIRATION_DAYS || 60;
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + tokenExpirationDays);

    return jwt.sign({
        id: this._id,
        email: this.email,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, SECRET);
};

UsersSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
}


mongoose.model('Users', UsersSchema);