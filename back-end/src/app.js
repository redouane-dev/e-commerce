'use strict';

const express = require('express');
const passport = require('passport');
// const cors = require('cors'),;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const logger = require('./config/logger');

// Constants
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

// MongoDB env variables
const MONGO_HOST = process.env.MONGO_HOST || '127.0.0.1';
const MONGO_USER = process.env.MONGO_INITDB_ROOT_USERNAME;
const MONGO_PASS = process.env.MONGO_INITDB_ROOT_PASSWORD;
const MONGO_DATA = process.env.MONGO_INITDB_DATABASE;
if (!MONGO_USER || !MONGO_PASS) {
    logger.error('MongoDB username or password not found');
    process.exit(9);
}


// Define app
const app = express();
app.use(morgan('dev'));
// app.user(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// //Error handlers & middlewares
// if(!isProduction) {
//   app.use((err, req, res) => {
//     res.status(err.status || 500);

//     res.json({
//       errors: {
//         message: err.message,
//         error: err,
//       },
//     });
//   });
// }


// Configure mongoose
mongoose.connect(
        // `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DATA}`,
        `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => logger.info('Connection to MongoDB successful'))
    .catch(err => logger.error('Connection to MongoDB failed...', err));
mongoose.set('debug', true);


// Models and Routes
require('./models/users');
require('./config/passport');
app.use(require('./routes'));


// Define routes
app.get('/', (req, res) => {
    res.status(200).send('Be water my friend!');
});


app.listen(PORT, HOST, () => logger.info(`Server listening on http://${HOST}:${PORT}`));