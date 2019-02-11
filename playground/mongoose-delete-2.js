const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');

const {Todo} = require('./../server/models/todo');

const {User} = require('./../server/models/Users');

var id = '5bef7eb813740f8519131e94';
if(!ObjectID.isValid(id)) {
    console.log("ID is not valid");
}
User.update({email:"alan.example.com"}, { $unset: {profiles: "daveysocket"
}} );

User.findOne({email:"alan@example.com"}). then((user) => {
    console.log("here");
    var field  = "daveysocket";
  user.set(`profiles.${field}` , undefined, {strict:true});
  user.save();
});

// User.findById('5becf824776b096d154fa82c').then((users) => {
//     if(!users) {
//        return console.log('Unable to find user');
//     } 
//     console.log('Users:' ,users);
// }).catch((e)=> {console.log(e);});