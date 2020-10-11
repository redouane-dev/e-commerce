const router = require('express').Router();

router.use('/api', require('./api'));

router.get('/', (req, res) => {
    res.status(200).send('Be water my friend!');
});

module.exports = router;