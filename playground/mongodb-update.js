
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
      

       // working on updates
       //updates on collections take 3 arguamnets
     // 1) the filter to which document to update
     // 2) the update operation (what to update)
     // 3) what to return (true returns the original doc and false returns the updated doc) 
    //   db.collection('Todos').findOneAndUpdate({_id: new ObjectID("5be826b606a6ea126172f8f7")},
    //       {
    //           $set: {
    //           completed : true
    //       }},{
    //           returnOriginal: false
          
    //       }).then((result) => {
    //         console.log(result);
    //       });

    db.collection('Users').findOneAndUpdate({_id: new ObjectID("5be8b2c8a2039e12f173506a")},
          {
              $set: {
              name : 'Alan'
          },
        $inc: {
            age: 1
        }
        },{
              returnOriginal: false
          
          }).then((result) => {
            console.log(result);
          });
      
     db.close();
});