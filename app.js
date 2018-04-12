const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();

	
	
app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 60000 }}));

//app.use(session());
 
// Access the session as req.session
app.get('/', function(req, res, next) {
  var sessData = req.session;

  //req.session.someAttribute = "foo";
  sessData.someAttribute = "foo";
  res.send('Returning with some text');
});


app.get('/bar', function(req, res, next) {
    var someAttribute = req.session.someAttribute;
    res.send(`This will print the attribute I set earlier: ${someAttribute}`);
  });

  app.listen(3000,function(){
    console.log("Server has started")
  })