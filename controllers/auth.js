const express = require("express");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
//------------------render sign up plate-----------------
router.get("/sign-up", (req, res, next) => {
  res.render("auth/sign-up.ejs");
});

// -----------------submit the form----------------------
router.post("/sign-up", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirm = req.body.confirmPassword;
  try {
    const exisitingUser = await User.findOne({
      username: req.body.username,
    });

    if (exisitingUser) {
      return res.send("Ooops Something went wrong");
    }

    if (password !== confirm) {
      return res.send("password and confirm not match");
    }

    const hashedPassword = bcrypt.hashSync(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );

    //Alternative way
    const payolad = { username, password: hashedPassword };
    const user = await User.create(payolad);
    res.send(`Thanks for signing up ${user.username}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
