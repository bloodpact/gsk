const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const ExcelJS = require("exceljs");
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
      res.send({
        id: user._id,
        number: user.number,
        email: user.email,
        taxData: user.taxData
      });
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
  }
});

router.post("/passUpdate", async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 12);
    await Users.findByIdAndUpdate(req.body.id, {
      password: password,
      newPassword: req.body.password
    });
    // const user = await Users.findById({ _id: req.body.id });
    res.send("pass updated");
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
  }
});

router.post("/emailUpdate", async (req, res) => {
  try {
    await Users.findByIdAndUpdate(req.body.id, { email: req.body.email });
    const user = await Users.findById({ _id: req.body.id });
    res.send({
      id: user._id,
      number: user.number,
      email: user.email,
      taxData: user.taxData
    });
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
      users: users.map(user => user.toJSON()),
      logged: req.session.logged
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

router.get("/load", async (req, res) => {
  try {
    const users = await Users.find();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("sheet", {
      pageSetup: { paperSize: 9, orientation: "landscape" }
    });
    worksheet.columns = [
      { header: "Место", key: "id", width: 10 },
      { header: "ФИО", key: "fio", width: 32 },
      { header: "Пароль", key: "pass", width: 32 },
      { header: "Email", key: "email", width: 32 },
      { header: "Телефон", key: "phone", width: 32 }
    ];
    users.forEach(u => {
      worksheet.addRow({
        id: u.number,
        fio: u.fio,
        pass: u.oldPassword,
        email: u.email,
        phone: u.phone
      });
    });
    res.attachment("./users.xls");
    await workbook.xlsx.write(res);
  } catch (e) {
    console.log(e);
  }
});

router.get("/register", async (req, res) => {
  try {
    res.render("users/userReg", { logged: req.session.logged });
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
    res.render("users/editUser", {
      user: user.toJSON(),
      logged: req.session.logged
    });
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

router.post("/filter", async (req, res) => {
  try {
    const users = await Users.find();
    if (req.body.place && req.body.place <= 270) {
      const place = users.filter(place => {
        return place.number === req.body.place;
      });
      if (place[0] === undefined) {
        res.render("users/userList", {
          users: users.map(user => user.toJSON()),
          notfound: "пользователь не найден",
          logged: req.session.logged
        });
      } else {
        res.render("users/userList", {
          place: place[0].toJSON(),
          logged: req.session.logged
        });
      }
    } else {
      res.redirect("/users");
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
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
