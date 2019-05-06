//Part 1: Creating our backend: 
//i. Initializing our project: npm init, 
//ii. Setting up our package.json: set the entry point to server.js instead of the default index.js, npm i bcryptjs body-parser concurrently express is-empty jsonwebtoken mongoose passport passport-jwt validator, npm i -D nodemon, changed "scripts": {"start": "node server.js","server": "nodemon server.js"}, 
//iii. Setting up our database: created cluster in mongoDB.Atlas (formally mlab), config && cd config && touch keys.js, to keys.js added module.exports = {mongoURI: "YOUR_MONGOURI_HERE"};
//iv. Setting up our server with Node.js and Express: in server.js Pulled in required dependencies (namely express, mongoose and bodyParser), Initialized our app using express(), Applied the middleware function for bodyparser, Pulled in our MongoURI from our keys.js file and connect to our MongoDB database, Set the port for our server to run on and have our app listen on this port, ran nodemon run server - server running!
//v. Setting up our database schema: mkdir models && cd models && touch User.js, in user.js: Pulled in our required dependencies, Created a Schema to represent a User, defining fields and types as objects of the Schema, Exported the model so we can access it outside of this file
//vi. Setting up form validation: mkdir validation && cd validation && touch register.js login.js, in register.js & login.js (same flow, different fields) Pulled in validator and is-empty dependencies, Exported the function validateRegisterInput, which takes in data as a parameter (sent from our frontend registration form, **not yet built), Instantiated our errors object, Converted all empty fields to an empty string before running validation checks (validator only works with strings), Checked for empty fields, valid email formats, password requirements and confirm password equality using validator functions, Returned our errors object with any and all errors contained as well as an isValid boolean that checks to see if we have any errors
//vii. Setting up our API routes: mkdir routes && cd routes && mkdir api && cd api && touch users.js, in users.js: pulled in required dependencies and loaded input validations & user model, for register endpoint, we pulled the errors and isValid variables from our validateRegisterInput(req.body) function and checked input validation. If valid input, use MongoDB’s User.findOne() to see if the user already exists.If user is a new user, fill in the fields (name, email, password) with data sent in the body of the request, used bcryptjs to hash the password before storing it in the database, cd config && touch passport.js, added secretOrKey: "secret" to key.js (config) **http://www.passportjs.org/packages/passport-jwt/ added requires parameters, variables and functions. in user.js : For our login endpoint, we pulled the errors and isValid variables from our validateLoginInput(req.body) function and checked input validation. If valid input, use MongoDB’s User.findOne() to see if the user exists. If user exists, use bcryptjs to compare submitted password with hashed password in our database. If passwords match, create our JWT Payload. Assigned our jwt, including our payload, keys.secretOrKey from keys.js, and set a expiresIn time (in seconds) If successful, will append the token to a Bearer string (**in passport.js file: setopts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();), in users.js exported module exports: router; required, added app.use for  passport, routes to server.js
//viii. Testing our API routes using Postman: added post to http://localhost:5000/api/users/register with keys and values 
//Part 2: Creating our frontend & setting up Redux
//i. Setting up our frontend: added to package.json -scripts - "client-install": "npm install --prefix client", "client": "npm start --prefix client", "dev": "concurrently \"npm run server\" \"npm run client\"", ran create-react-app client, added "proxy": "http://localhost:5000" to client - scripts - package.json, installed in client - npm i axios classnames jwt-decode react-redux react-router-dom redux redux-thunk, tested by running npm run dev//Removes logo.svg in client/src, removed the import of logo.svg in App.js, Removed all the CSS in App.css, Cleared out the content in the main div in App.js and replaced it with an <h1> for now
//*****Important note: added materialize css, js under client/public/index.html to follow along with tutorial - can remove later when implementing other aspects of app **** */
//ii. Creating our static components: src mkdir components && cd components && mkdir layout && cd layout && touch Navbar.js Landing.js  -- added navbar and landing components under component/layout using {link} from react-router-dom as well as html, css written as jsx.  Imported navbar and landing into app.js and added to render.  added to components: mkdir auth && cd auth && touch Login.js Register.js  Added onchange events and onSubmit event, with e.preventDefault() https://reactjs.org/docs/forms.html https://reactjs.org/docs/handling-events.html Defined routing paths in app.js
//iii. Setting up Redux for state management: video: https://www.youtube.com/watch?v=93p3LxR9xfM&feature=youtu.be in src ran touch store.js && mkdir actions reducers && cd reducers && touch index.js authReducers.js errorReducers.js && cd ../ && cd actions && touch authActions.js types.js Passed an empty rootReducer in store for now as the first parameter to createStore() since reducers have not been created yet.  Added types to types.js under actions to dispatch actions for "GET_ERRORS", "USER_LOADING", "SET_CURRENT_USER"; Created reducers: Reducers are pure functions that specify how application state should change in response to an action. Reducers respond with the new state, which is passed to our store and, in turn, our UI.  Reducers used to Import all our actions from our types.js file, Define our initialState, Define how state should change based on actions with a switch statement.  Added combinedReducers from redux to combine our authReducer and errorReducer into one rootReducer.  added to src mkdir utils && cd utils && touch setAuthToken.js.  added setAuthtoken.js to to set and delete the Authorization header for our axios requests depending on whether a user is logged in or not. Set actions/authactions to Import dependencies and action definitions from types.js, Use axios to make HTTPRequests within certain action, Use dispatch to send actions to our reducers. Added rootreducer to store.js
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