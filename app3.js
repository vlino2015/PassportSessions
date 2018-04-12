var express = require('express');
var session = require("express-session");
var bodyParser = require("body-parser");
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');


var app = express();

// initialze array to store list of users
let users = [];


app.use(bodyParser.urlencoded({ extended: false }));

// initialize express session
app.use(require('express-session')({
    secret : 'cat',
    resave :false,
    saveUninitialized : false
  }));

// setting up passport
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', function(req, res) {
 

    res.send(
        ` 
            <h1>Login</h1>
            <form action="/login" method="post">
                <div>
                    <label>Username:</label>
                    <input type="text" name="username"/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password"/>
                </div>
                <div>
                    <input type="submit" value="Log In"/>
                </div>
            </form>
        `
    ); //end of res.send
    console.log(users);
});//end of app.get

app.post('/login',
  passport.authenticate('local', { successRedirect: '/dashboard',
                                   failureRedirect: '/login'})
);


app.get('/register', function(req, res) {
 

    res.send(
        ` 
        <h1>Registration</h1>

        <form action="/register" method="POST">
          <input type="text" name="username" />
          <input type="text" name="password" />
          <input type="submit" />
        </form>
        `
    ); //end of res.send
    
});//end of app.get

app.post('/register',function(req,res){

    let username = req.body.username;
    // hashing the password
    let password = bcrypt.hashSync(req.body.password,8);
  
  
    users.push({ username : username, password : password});
    console.log(users);
    res.redirect('/login');
  });

  app.get('/dashboard',function(req,res){

    if(!req.isAuthenticated()) {
        res.redirect('/login');
      return
    }
  
    res.send("you've arrived here, so you must be authenticated")
  })

  app.get('/beer',function(req,res){

    if(!req.isAuthenticated()) {
        res.redirect('/login');
      return
    }
  
    res.send("Beer Page - I'm letting you see this")
  })

  app.get('/blah',function(req,res){

    
  
    res.send("blah: everyone can access this page")
  })

// passport Strategy
passport.use(new LocalStrategy(

    function(username,password,done) {
  ///////////
      let user = users.find((user) => {
        return (user.username == username && bcrypt.compareSync(password,user.password))
      });
  
      if(!user) {
          return done(null,false, { message : "Incorrect credentials" });
      }
  
      return done(null,username)
    }
  ));

// passport.use(new LocalStrategy(
//     function(username, password, done) {
//       User.findOne({ username: username }, function(err, user) {
//         if (err) { return done(err); }
//         if (!user) {
//           return done(null, false, { message: 'Incorrect username.' });
//         }
//         if (!user.validPassword(password)) {
//           return done(null, false, { message: 'Incorrect password.' });
//         }
//         return done(null, user);
//       });
//     }
//   ));


// serialize
passport.serializeUser(function(user,done){
    done(null,user);
  })
  
  // deserialize
  passport.deserializeUser(function(user,done){
        console.log('Deserialize user called.');
        return done(null, { firstName: 'Foo', lastName: 'Bar' });
  })

// passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });

//   passport.deserializeUser(function(id, done) {
//     console.log('Deserialize user called.');
//     return done(null, { firstName: 'Foo', lastName: 'Bar' });
//   });
  
//   passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//       done(err, user);
//     });
//   });


 

app.listen(3000, function(){
    console.log('Example app listening on port 3000');
});

