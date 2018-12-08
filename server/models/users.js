const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
// we need to add methods to our mongoose model mongoose allows use to do 
//this by using a mongoose schema
 var UserSchema = mongoose.Schema({
  email: {
       type:String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
          validator: (value) => {
            return validator.isEmail(value);
          },
          message: '{VALUE} is not a valid email'
        }

  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
  token: {
    type: String,
    required: true
  }
  }]
});

//customize what data that is data is being send back from mongoose.
UserSchema.methods.toJSON = function () {
    var user = this;
     var userObject = user.toObject();
      return _.pick(userObject,['_id', 'email']);
};
//we use a regular function here and not an arrow function because arrow 
// functions do not allow the use of the this keyword
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token =  jwt.sign({_id:user._id.toHexString(), access},'abc123').toString();
  user.tokens =  user.tokens.concat([{access,token}]);
   return user.save().then(() => {

    return token;
  });
};
// creates a model method and not a instanr method
UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token,'abc123');

  } catch(e) {
     
    return Promise.reject();
  }

  return User.findOne({
     _id: decoded._id,
     'tokens.token': token,
     'tokens.access': 'auth'
  });
};
UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;

   return User.findOne({email}).then((user) => {
      if(!user) {
       console.log('no user so reject');
       return Promise.reject();
     }

     return new Promise((resolve,reject) => {
        bcrypt.compare('test1234',user.password, (err,result) => {
          console.log(user.password);
          console.log(err);
         if(result) {
           console.log('good token');
              resolve(user);
         } else {
           console.log('reject');
           reject('no match');
         }
        });

   });
  });
 };

UserSchema.pre('save',function(next) {
 var user = this;
  if(user.isModified('password')) {
    bcrypt.genSalt(10,(err,salt) => {
      bcrypt.hash(user.password,salt,(err,hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

  module.exports = {User};
  