var {User} = require('./../models/users');

// Create a middleware function
var authenticate =  (req, res) => {
    var token = req.header('x-auth');
    User.findByToken(token).then((user)=> {
        if(!user) {
          return Promise.reject();
        }
 
       req.user = user;
       req.token = token;
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = {authenticate};