var express = require('express');

var bodyParser = require('body-parser');


var {mongoose} =  require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/users');

var app = express();
//middleware config
app.use(bodyParser.json());

app.post('/todos', (req,res) => {
   console.log(req.body);
   var todo = new Todo({
       text: req.body.text,
       completed: req.body.completed
   });
   todo.save().then((doc) => {
      res.send(doc);
   }, (e) => {
       res.status(400).send(e);
     console.log('Unable to save', e);
   });
});

app.get('/todos', (req,res) => {
   Todo.find().then((todos) => {
       res.send({todos});
   })
}, (err) => {
    res.status(400).send();
});

app.listen(3000, () => {
    console.log('Started on port 3000');
})

//mongoose uses a model




// var newTodo = new Todo({
//     text: 'Cook Dinner'
// });

// var newTodo = new Todo({
//          text: '',
//          completed: true,
//          completedAt: 20181114
//    });

// newTodo.save().then((doc) => {
//   console.log('Saved todo: ', doc);
// }, (err) => {
//    console.log("Unable to save doc",err);
// });

// var newUser =  new User({
//    email: 'afrye@gmail.com'
// });

// newUser.save().then((doc) => {
//   console.log('Saved user',doc)
// }, (err) => {
//     console.log('Unable top save user', err);
// });

module.exports = {app};