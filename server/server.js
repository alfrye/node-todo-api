const _ = require('lodash');
var express = require('express');

var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} =  require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/users');

const port = (process.env.PORT || 3000);

var app = express();
//middleware config
app.use(bodyParser.json());

app.post('/todos', (req,res) => {
   console.log(req.body);
   var todo = new Todo({
       text: req.body.text
     
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

app.get('/todos/:id' , (req,res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)) {
     return res.status(404).send();
  }
  Todo.findById(id).then((todo) => {
       if(!todo) {
           res.status(404).send();
       }
       res.status(200).send(todo);
  }).catch((e) => {res.status(400).send();})
}, (err) => {
  res.status(400).send();
});

app.delete('/todos/:id', (req,res) =>{
   var id = req.params.id
   if(!ObjectID.isValid(id)) {
       return res.status(404).send();
   }
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((e) => {return res.status(400).send();})

});

app.patch('/todos/:id', (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
    }
   
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt =  new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null; 
    }
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
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