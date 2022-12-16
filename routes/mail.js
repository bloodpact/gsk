const express = require("express");
const router = express.Router();
const User = require("../models/Users");

const { mailer } = require("../config/mailHelper");

router.post("/", (req, res) => {
  mailer(req.body.email, req.body.place)
    .then(res.end())
    .catch(console.error);
});
router.post("/update", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.id, { email: req.body.email });
    res.send("success upd");
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
  }
});
module.exports = router;
