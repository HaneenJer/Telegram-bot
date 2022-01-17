
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const axios = require("axios");


const app = express();
const port = process.env.PORT || 4000;

// static user details
const userData = {
  userId: "789789",
  password: "236369",
  name: "Admin",
  username: "admin",
  isAdmin: true
};


  let admins = [];
  let i = 0;
  async function fetchAdmins(){
        try {
            const data = await axios.get('http://localhost:5000/admins');
            const {admins} = data.data
            //console.log(admins);
            Object.entries(admins).forEach((entry) => {
              const [key, value] = entry;
              //console.log(`entry: `);
              //console.log(entry);
              //console.log(`key: `);
              //console.log(key);
              //console.log(`value: `);
              //console.log(value);
              admins[i] = value;
              //console.log(`admins[i]: `);
              //console.log(admins[i]);
              i = i +1;
            });
            return Promise.all(admins);
        } catch (err) {
            console.error(err.message);
        }
    };

// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


//middleware that checks if JWT token exists and verifies it if it does exist.
//In all future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['authorization'];
  if (!token) return next(); //if no token, continue

  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      next();
    }
  });
});


// request handlers
app.get('/', (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Invalid user to access it.' });
  res.send('Welcome to the Node.js Tutorial! - ' + req.user.name);
});


// validate the user credentials
app.post('/users/signin', function (req, res) {
  const user = req.body.username;
  const pwd = req.body.password;

  // return 400 status if username/password is not exist
  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username or Password required."
    });
  }
  let isAdmin = 0;
  fetchAdmins().then(function(result) {
    admins = result;
    var isAdmin = 0;
    var adminsLength = admins.length;
    for (i = 0; i < adminsLength; i++) {
      console.log('i')
      console.log(i)
      console.log('admins[i]')
      console.log(admins[i])
      Object.entries(admins[i]).forEach(([key, value]) => {
        if (key === 'name' && value === user) {
          isAdmin = 1;
        }
        if (key === 'password' && value !== pwd) {
          isAdmin = 0;
        }
      });
      if (isAdmin === 1) {
        i = adminsLength
      }
    }
    i = 0;
    // return 401 status if the credential is not match.
    //if (user !== userData.username || pwd !== userData.password) {
    if (isAdmin === 0) {
      return res.status(401).json({
        error: true,
        message: "Username or Password is Wrong."
      });
    }
    else{
      userData.name = user;
      userData.username = user;
      userData.password = pwd;
    }
    // generate token
    const token = utils.generateToken(userData);
    // get basic user details
    const userObj = utils.getCleanUser(userData);
    console.log(userObj);
    // return the token along with user details
    return res.json({ user: userObj, token });
  });


});


// verify the token and return it if it's valid
app.get('/verifyToken', function (req, res) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token;
  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token is required."
    });
  }
  // check token that was passed by decoding token using secret
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) return res.status(401).json({
      error: true,
      message: "Invalid token."
    });

    // return 401 status if the userId does not match.
    if (user.userId !== userData.userId) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    }
    // get basic user details
    var userObj = utils.getCleanUser(userData);
    return res.json({ user: userObj, token });
  });
});

app.listen(port, () => {
  console.log('Server started on: ' + port);
});