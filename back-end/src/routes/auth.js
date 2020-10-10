const { readFileSync } = require('fs');
const jwt = require('express-jwt');

// Read the private key used to verify tokens
const SECRET = readFileSync('./private.key', 'utf-8');

const getTokenFromHeaders = (req) => {
    const { headers: { authorization } } = req;

    if (authorization && authorization.split(' ')[0] === 'Bearer')
        return authorization.split(' ')[1];
    
    return null;
};

const auth = {
    required: jwt({
        secret: SECRET,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        algorithms: ['HS256'],
    }),
    optional: jwt({
        secret: SECRET,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        algorithms: ['HS256'],
        credentialsRequired: false,
    }),
};

module.exports = auth;