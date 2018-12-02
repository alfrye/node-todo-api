var {User} = require('./../models/users');

// Create a middleware function
var authenticate =  (req, res,next) => {
    var token = req.header('x-auth');
    User.findByToken(token).then((user)=> {
        console.log('auth');
        if(!user) {
          return Promise.reject();
        }
 
       req.user = user;
       req.token = token;
       next();
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = {authenticate};