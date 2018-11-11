
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
   if(err) {
       return console.log('Unable to connect to mongodb server');
   }

   console.log('Connected to MongoDB server');
   db.collection('Todos').find().toArray().then ((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs,undefined,2));
   }, (err) => {
    console.log('Unable to fetch Todos');
   });

db.collection('Todos').find().count().then ((count) => {
    console.log(`Todos count: ${count}`);
    //console.log(JSON.stringify(docs,undefined,2));
   }, (err) => {
    console.log('Unable to fetch Todos');
   });

   db.collection('Users').find({name: 'A;an Frye'}).toArray().then ((docs) => {
    console.log(`Users`);
    console.log(JSON.stringify(docs,undefined,2));
   }, (err) => {
    console.log('Unable to fetch Todos');
   });

   db.collection('Users').find().toArray().then ((docs) => {
    console.log(`Users`);
    console.log(JSON.stringify(docs,undefined,2));
   }, (err) => {
    console.log('Unable to fetch Todos');
   });
   
   db.close();
});