const express = require("express");
const router = express.Router();
const moment = require("moment");
const fs = require("fs");
const Rates = require("../models/Rates");
router.get("/", async (req, res) => {
  const rates = await Rates.find().sort({
    query: -1
  });
  res.render("rates/rates", {
    rates: rates.map(ratesItem => {
      return ratesItem.toJSON();
    }),
    logged: req.session.logged
  });
});
router.get("/api", async (req, res) => {
  try {
    const rates = await Rates.find().sort({
      query: -1
    });
    await res.json(rates);
  } catch (e) {
    res.status(500).send("internal server error");
    console.error(e.message);
  }
});
router.post("/", async (req, res) => {
  try {
    const maxQuery = await Rates.find()
      .sort({ query: -1 })
      .limit(1);
    const newRates = new Rates({
      month: req.body.month,
      sum: req.body.sum.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 "),
      query: maxQuery[0].query + 1
    });
    await newRates.save();
    res.redirect("/rates");
  } catch (e) {
    console.log(e);
  }
});
router.post("/delete/:id", async (req, res) => {
  try {
    await Rates.findByIdAndRemove(req.params.id);
    res.redirect("/rates");
  } catch (e) {
    res.status(500).send("internal server error");
    console.error(e.message);
  }
});
router.get("/load", async (req, res) => {
  fs.readFile("./routes/rates.json", "utf8", function(error, data) {
    JSON.parse(data).forEach(el => {
      const newRates = new Rates({
        month: el.month,
        sum: el.price.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 "),
        query: el.id
      });
      newRates.save();
    });
  });
  res.redirect("/rates");
});
module.exports = router;
