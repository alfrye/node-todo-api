const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/users');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
 beforeEach(populateTodos);

 
describe('POST /todos', () => {
    it('should create a new todo', (done) => {
      var text = 'Test todo text';
      request(app)
      .post('/todos')
      .send({text}) 
      .expect(200)
      .expect((res) => {
          expect(res.body.text).toBe(text);
      })
      .end((err,res) => {
          if(err) {
              return done(err);
          }
          Todo.find({text}).then((todos) => {
              expect(todos.length).toBe(1);
              expect(todos[0].text).toBe(text);
              done();

          }).catch((e) => {
              done(e);
          }) 
      })
    });

    it('should not create a todo with invalid body data', (done)=> {
       request(app)
       .post('/todos')
       .send({})
       .expect(400)
       .end((err,res) => {
           if(err) {
               return done(err);
           }
           Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
           }).catch((e) => done(e));
       });
    });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
     request(app)
     .get('/todos')
     .expect(200)
     .expect((res) => {
       expect(res.body.todos.length).toBe(2);
     })
     .end(done);
  }); 
});

describe('GET /todos/id' , () => {
   it('should return to docs' , (done) => {
       request(app)
       .get(`/todos/${todos[0]._id.toHexString()}`)
       .expect(200)
       .expect((res) => {
           expect(res.body.text).toBe(todos[0].text);
       })
         .end(done);
   });

   it('should return 404 if todo is not found', (done) => {
        var id = new ObjectID();
         request(app)
         .get(`/todos/${id.toHexString()}`)
         .expect(404)
         .end(done);
   });

   it('should return 404 if non-object ids', (done) => {
   
    request(app)
    .get(`/todos/123`)
    .expect(404)
    .end(done);
});
   
});

describe('DELETE /todo/:id', () => {

    it('should remove a todo', (done) => {
        var id = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(id);
        })
        .end((err,res) => {
            if(err) {
                return done(err);
            }
            Todo.findById(id).then((todo) => {
               expect(todo).toNotExist();
               done();

            }).catch((e) => {
              done(e);
            });
        })
    });

    it('should return 404 if todo not found ' , (done) => {
        var id = new ObjectID();
        request(app)
        .delete(`/todos/${id.toHexString()}`)
        .expect(404)
        .end(done);
    });


    it('should return 404 if object id is invalid' , (done) => {
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
        });


});

describe('PATCH /todos/:id', () => {
  it('should update to the todo', (done) => {
    //grab id of first item
    // update text and completed to true
    // respomse body is changed and completed is true and completedAt is a number
    var id = todos[0]._id.toHexString();
    var text = 'updated from test';
     request(app)
     .patch(`/todos/${id}`)
     .send({text,completed:true})
     .expect(200)
     .expect((res) => {
         console.log(res.body.todo.text);
         expect(res.body.todo.text).toBe(text);
         expect(res.body.todo.completed).toBe(true);
         expect(res.body.todo.completedAt).toBeA('number');

     })
     .end(done);
    }); 

  it('should clear compleedAt when todo is not complete', (done) => {
    // grad id of second item 
    // update text, set completed to false and completedAT to null
     var id = todos[1]._id.toHexString();
     var text = 'updated from test';
     request(app)
     .patch(`/todos/${id}` )
     .send({text,completed:false})
     .expect(200)
     .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
     })
     .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
             console.log(res.body._id);
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
           // done();
        })
        .end(done);

    });

    it('should return 401 if not authenticated', (done) => {
       request(app)
       .get('/users/me')
       .expect(401)
       .expect((res) => {
           expect(res.body).toEqual({});

       })
       .end(done);
    });
    
});

describe('POST /users', () => {
  it('should create a user', (done) => {
      
      request(app)
      .post('/users')
      .send({
        email:'alan@yahoo.com',
        password: 'userpass'
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe('alan@yahoo.com');
        })
        .end((err) => {
            if(err) {
                return done(err);
            }

            User.findOne({email:'alan@yahoo.com'}).then((user) => {
               expect(user).toExist();
               expect(user.password).toNotBe('alan@yahoo.com');
               done();
            });
        });

  });

  it('should return validation error if request is invalid', (done) => {
    request(app)
    .post('/users')
    .send({
      email:'test@yahoo.com',
      password: 'user'
      })
      .expect(400)
     .end(done);
   });

   it('should not create a user if email is use', (done) => {
    request(app)
    .post('/users')
    .send({
      email:'steve@example.com',
      password: 'userpassword'
      })
      .expect(400)
     .end(done);
   });


});

describe('POST /users/login', () => {
   it('should login user and return auth token', (done) => {
       request(app)
       .post('/users/login')
       .send({
         email: users[1].email,
         password: users[1].password
       })
       .expect(200)
       .expect((res) => {
           expect(res.headers['x-auth']).toExist();
       })
       .end((err,res) => {
           if(err) {
               return done(err);
           }
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[0]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                done();
            }).catch((err)=> done(err));
       });
   });

   it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: 'password'
    })
    .expect(400)
    .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
    })
    .end((err,res) => {
        if(err) {
            return done(err);
        }
         User.findById(users[1]._id).then((user) => {
             expect(user.tokens.length).toBe(0);
             done();
         }).catch((err)=> done(err));
    });


   });
});