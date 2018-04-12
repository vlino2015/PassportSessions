// load dependencies
var express = require('express')
var Sequelize = require('sequelize')
var cookieParser = require('cookie-parser')
var session = require('express-session');

// initalize sequelize with session store
var SequelizeStore = require('connect-session-sequelize')(session.Store);

// create database, ensure 'sqlite3' in your package.json
var connection = new Sequelize('postgres://localhost:5432/seqClass');


var myStore = new SequelizeStore({
    db: connection
})

// configure express
var app = express();
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  store: myStore,
  resave: false, // we support the touch method so per the express-session docs this should be set to false
  proxy: true // if you do SSL outside of node.
}));

myStore.sync();
// continue as normal