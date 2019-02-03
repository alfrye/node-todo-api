require('./config/config.js');
const _ = require('lodash');
var express = require('express');

var bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose.js');
var { Todo } = require('./models/todo');
var { User } = require('./models/users');
var { authenticate } = require('./middleware/authenticate');

var app = express();
//middleware config
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id

    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
        //console.log('Unable to save', e);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({ _creator: req.user._id }).then((todos) => {
        res.send({ todos });
    })
}, (err) => {
    res.status(400).send();
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findOne({ _id: id, _creator: req.user._id }).then((todo) => {
        if (!todo) {
            res.status(404).send();
        }
        res.status(200).send(todo);
    }).catch((e) => { res.status(400).send(); })
}, (err) => {
    res.status(400).send();
});

app.delete('/todos/:id', authenticate, async (req, res) => {
    var id = req.params.id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    try {
        const todo = await Todo.findOneAndRemove({ _id: id, _creator: req.user._id });
        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({ todo });
    } catch (err) {
        res.status(400).send();
    }

});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((e) => {
        res.status(400).send();
    })
});

app.post('/users', async (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);
    console.log(body);
    var user = new User(body);
    try {
        await user.save()
      var token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);

    } catch (err) {
        res.status(400).send(err);
    }
  


    // user.save().then(() => {
    //     return user.generateAuthToken();
    // }).then((token) => {

    //     res.header('x-auth', token).send(user);
    // }).catch((err) => {
    //     res.status(400).send(err);
    //     // console.log('Unable to save user', err);
    // })
});


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    console.log(body.password);
    //res.send(body);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => {
        console.log('error');
        res.status(400).send(err);
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Started on port ${process.env.PORT}`);
});

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

module.exports = { app };