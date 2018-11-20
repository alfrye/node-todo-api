var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // need to inform mongoose on what promise library to use
mongoose.connect(process.env.MONGODB_URI|| 'mongodb://localhost:27017/TodoApp');

module.export = {mongoose};