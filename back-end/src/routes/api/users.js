const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const logger = require('../../config/logger');
const Users = mongoose.model('Users');

// POST route for adding new users
router.post('/', auth.optional, (req, res) => {
    const { body: { user } } = req;
    if (!user.email || !user.password) return res.status(422).json({
        errors: { emailOrPassword: 'is required' }
    });

    // Check if user already exists and proceed
    Users.findOne({ email: user.email })
        .then(existingUser => {
            if (existingUser) return res.json({ error: { email: 'already exists' }});

            const finalUser = new Users(user);
            finalUser.setPassword(user.password);

            return finalUser
                .save()
                .then(() => res.status(201).json({ user: finalUser.toAuthJSON() }));
        })
        .catch(err => {
            logger.error('Failed to check if user already exists...', err);
            return res.status(503).json({ error: { registration: 'temporary failure' } });
        });
});

// POST route for login
router.post('/login', auth.optional, (req, res, next) => {
    const { body: { user } } = req;
    if (!user.email || !user.password) return res.status(422).json({
        error: { emailOrPassword: 'is required' }
    });

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if (err) return next(err);
        if (passportUser) return res.json({ user: passportUser.toAuthJSON() });
        return res.status(400).info;
    })(req, res, next);
});

// GET route for current user
router.get('/current', auth.required, (req, res) =>{
    // TODO: Handle UnauthorizedError: No authorization token was found

    const { payload: { id } } = req;
    return Users.findById(id)
        .then(user => {
            if (!user) return res.status(400);
            return res.json({ user: user.toAuthJSON() });
        });
    // TODO: add handling of exceptions
});

module.exports = router;