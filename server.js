const dotenv = require("dotenv");
dotenv.config();
const express = require("express");

require("./config/database");

const methodOverride = require("method-override");
const morgan = require("morgan");

const app = express();
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
app.get("/", async (req, res) => {
  res.render("index.ejs");
});
//ROUTES
app.use("/auth", authCtrl);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
