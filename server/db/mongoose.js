var mongoose = require('mongoose');

mongoose.Promise = global.Promise; // need to inform mongoose on what promise library to use
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.export = {mongoose};