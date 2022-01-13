const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mySuperSecretDB', {useUnifiedTopology: true});

require('./user');