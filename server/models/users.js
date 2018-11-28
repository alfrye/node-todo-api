const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
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
    require: true,
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

var User = mongoose.model('User', UserSchema);

  module.exports = {User};
  