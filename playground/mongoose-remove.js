const {ObjectID} = require('mongodb');
const {mongoose} = require('../server/db/mongoose');

const {Todo} = require('../server/models/todo');

const {User} = require('../server/models/Users');

//Tood.remove
// Todo.remove({}).then((result) => {
//    console.log(result);
// });

//Both of these return the removed doc
//Todo.findOneAndRemove
//Todo.findByIdAndRemove

Todo.findOneAndRemove('5bf1708c30c4f46c20e773bc').then((todo) => {
    console.log(todo);
});