const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passGen = require("../config/passGen");
const Users = require("../models/Users");
//API from front req
router.post("/login", async (req, res) => {
  try {
    const { number, password } = req.body;
    const user = await Users.findOne({
      number
    });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "неправильный пароль" });
    } else {
      res.send({ id: user._id, number: user.number, taxData: user.taxData });
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
  }
});
router.post("/passUpdate", async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 12);
    await Users.findByIdAndUpdate(req.body.id, { password });
    res.send("success upd");
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
  }
});
//API from server req
router.get("/", async (req, res) => {
  try {
    const users = await Users.find();
    res.render("users/userList", {
      users
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
  }
});
router.post("/register", async (req, res) => {
  try {
    const { number, fio, email, phone } = req.body;
    const password = passGen();
    const hashedPass = await bcrypt.hash(password, 12);
    const newUser = new Users({
      number,
      password: hashedPass,
      oldPassword: password,
      fio,
      phone,
      email
    });
    await newUser.save();
    res.redirect("/users");
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
  }
});
router.get("/register", async (req, res) => {
  try {
    res.render("users/userReg");
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
  }
});
router.post("/delete/:id", async (req, res) => {
  try {
    await Users.findByIdAndRemove(req.params.id);
    res.redirect("/users");
  } catch (e) {
    res.status(500).send("internal server error");
    console.error(e.message);
  }
});
router.get("/edit/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    res.render("users/editUser", { user });
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
  }
});
router.post("/edit/:id", async (req, res) => {
  const { number, phone, fio, email } = req.body;
  try {
    await Users.findByIdAndUpdate(req.params.id, { number, phone, fio, email });
    res.redirect("/users");
  } catch (e) {
    res.status(500).send("internal server error");
    console.error(e.message);
  }
});

//load all users data
router.post("/loadUsers", async (req, res) => {
  try {
    for (const el of req.body) {
      const { place, owner, email } = el;
      const password = passGen();
      const hashedPass = await bcrypt.hash(password, 12);
      const newUser = new Users({
        number: place,
        password: hashedPass,
        oldPassword: password,
        fio: owner,
        email
      });
      await newUser.save();
    }
    res.send("/users");
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
  }
});
module.exports = router;
