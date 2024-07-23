const dotenv = require("dotenv");
dotenv.config();
const MongoStore = require("connect-mongo");
const express = require("express");
const session = require("express-session");
require("./config/database");
const app = express();
const methodOverride = require("method-override");
const morgan = require("morgan");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

//MIDDLEWARE

//CONTROLLER
const authCtrl = require("./controllers/auth.js");
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false })); //takes form date convert it to object (saved in the body)
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan("dev"));
app.use("/auth", authCtrl);

//ROUTES
app.get("/", async (req, res) => {
  const user = req.session.user;
  res.render("index.ejs", { user });
});
app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send("Sorry, no guests allowed.");
  }
});

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
