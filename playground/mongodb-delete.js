
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
   if(err) {
       return console.log('Unable to connect to mongodb server');
   }

   console.log('Connected to MongoDB server');
   //delete many 
    // db.collection('Todos').deleteMany({text:'Eat Lunch'}).then((result) => {
    //   console.log(result);
    // });
   
    //delete one 
    // db.collection('Todos').deleteOne({text:'Eat Lunch'}).then((result) => {
    //     console.log(result);
    //   });

    //findonedelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    //   });
 
    //delete all users A;lan Frye
    //     db.collection('Users').deleteMany({name:'A;an Frye'}).then((result) => {
    //   console.log(result);
    // });
   
       //delete  users by object id 
       db.collection('Users').findOneAndDelete({_id:new ObjectID("5be8b2e527269912f924a7f7")}).then((result) => {
        console.log(result);
      });
    db.close();
});