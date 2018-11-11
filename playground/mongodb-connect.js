//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);
//ES 6 feature object destructuring 
// var user = {name:'Alan', age:50};
// var {name} = user;  // creates a variable named name with the value
// from the user object
//console.log(name);
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
   if(err) {
       return console.log('Unable to connect to mongodb server');
   }

   console.log('Connected to MongoDB server');
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err,result) => {
    //     if(err) {
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops,undefined, 2));

    // });

    // db.collection('Users').insertOne({
    //     name: 'A;an Frye',
    //     age: 50,
    //     location: 'Chattanooga'
    // }, (err,result) => {
    //     if(err) {
    //         return console.log('Unable to insert Users', err);
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined, 2));

    // });
   db.close();
});