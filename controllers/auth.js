const express = require("express");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
// -----------------Register---------------------
router.get("/sign-up", (req, res, next) => {
  res.render("auth/sign-up.ejs");
});
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
// --------------LOGIN--------------------
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});
router.post("/sign-in", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const exisitingUser = await User.findOne({
    username: req.body.username,
  });

  if (!exisitingUser) {
    return res.send("Some things Invalid");
  }
  const validPassword = await bcrypt.compare(password, exisitingUser.password);

  if (!validPassword) {
    res.send('Some things Invalid"');
  }

  req.session.user = {
    username: exisitingUser.username,
    _id: exisitingUser.id,
  };
  console.log(req.session.user);
  // res.redirect("/");
  // if we use database session strategy we need ti listen to session store
  req.session.save(() => {
    res.redirect("/");
  });
});
router.get("/sign-out", (req, res) => {
  // req.session.destroy();
  // res.redirect("/");
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
