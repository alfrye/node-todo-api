const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');

const {Todo} = require('./../server/models/todo');

const {User} = require('./../server/models/Users');

var id = '5bef7eb813740f8519131e94';
if(!ObjectID.isValid(id)) {
    console.log("ID is not valid");
}

//retunrs all todos
Todo.find().then((todos) => {
    console.log('Todos:', todos);
});

Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos:', todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo:', todo);
});


Todo.findById(id).then((todo) => {
    console.log('Todo:', todo);
}).catch((e) => {console.log(e)});


User.findById('5becf824776b096d154fa82c').then((users) => {
    if(!users) {
       return console.log('Unable to find user');
    } 
    console.log('Users:' ,users);
}).catch((e)=> {console.log(e);});