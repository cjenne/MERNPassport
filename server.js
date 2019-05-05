//Part 1: Creating our backend: 
//i. Initializing our project: npm init, 
//ii. Setting up our package.json: set the entry point to server.js instead of the default index.js, npm i bcryptjs body-parser concurrently express is-empty jsonwebtoken mongoose passport passport-jwt validator, npm i -D nodemon, changed "scripts": {"start": "node server.js","server": "nodemon server.js"}, 
//iii. Setting up our database: created cluster in mongoDB.Atlas (formally mlab), config && cd config && touch keys.js, to keys.js added module.exports = {mongoURI: "YOUR_MONGOURI_HERE"};
//iv. Setting up our server with Node.js and Express: in server.js Pulled in required dependencies (namely express, mongoose and bodyParser), Initialized our app using express(), Applied the middleware function for bodyparser, Pulled in our MongoURI from our keys.js file and connect to our MongoDB database, Set the port for our server to run on and have our app listen on this port, ran nodemon run server - server running!
//v. Setting up our database schema: mkdir models && cd models && touch User.js, in user.js: Pulled in our required dependencies, Created a Schema to represent a User, defining fields and types as objects of the Schema, Exported the model so we can access it outside of this file
//vi. Setting up form validation: mkdir validation && cd validation && touch register.js login.js, in register.js & login.js (same flow, different fields) Pulled in validator and is-empty dependencies, Exported the function validateRegisterInput, which takes in data as a parameter (sent from our frontend registration form, **not yet built), Instantiated our errors object, Converted all empty fields to an empty string before running validation checks (validator only works with strings), Checked for empty fields, valid email formats, password requirements and confirm password equality using validator functions, Returned our errors object with any and all errors contained as well as an isValid boolean that checks to see if we have any errors
//vii. Setting up our API routes: mkdir routes && cd routes && mkdir api && cd api && touch users.js, in users.js: pulled in required dependencies and loaded input validations & user model, for register endpoint, we pulled the errors and isValid variables from our validateRegisterInput(req.body) function and checked input validation. If valid input, use MongoDB’s User.findOne() to see if the user already exists.If user is a new user, fill in the fields (name, email, password) with data sent in the body of the request, used bcryptjs to hash the password before storing it in the database, cd config && touch passport.js, added secretOrKey: "secret" to key.js (config) **http://www.passportjs.org/packages/passport-jwt/ added requires parameters, variables and functions. in user.js : For our login endpoint, we pulled the errors and isValid variables from our validateLoginInput(req.body) function and checked input validation. If valid input, use MongoDB’s User.findOne() to see if the user exists. If user exists, use bcryptjs to compare submitted password with hashed password in our database. If passwords match, create our JWT Payload. Assigned our jwt, including our payload, keys.secretOrKey from keys.js, and set a expiresIn time (in seconds) If successful, will append the token to a Bearer string (**in passport.js file: setopts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();), in users.js exported module exports: router; required, added app.use for  passport, routes to server.js
//viii. Testing our API routes using Postman: 
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const app = express();
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server running on port ${port} !`));