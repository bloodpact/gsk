const express = require("express");
const router = express.Router();
const _ = require("lodash");

const TarifData = require("../models/TarifData");
const Users = require("../models/Users");
//post req from 1c to save on DB
router.post("/", async (req, res) => {
  try {
    for (const reqEl of req.body) {
      //get the exact place
      const user = await Users.findOne({ number: reqEl.place });
      //check for existence of place in DB
      if (user) {
        //git rid of same date from 1C and merge them into array
        const newTaxData = _.concat(user.taxData, reqEl);
        const uniqueTaxData = _.uniqBy(newTaxData, "date");
        await Users.findOneAndUpdate(
          { number: reqEl.place },
          { taxData: uniqueTaxData },
          { upsert: true, useFindAndModify: false }
        );
      } else {
        console.log(`fill the data in 1c ${reqEl.place}`);
      }
    }
    res.send("/users");
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
  }
});
router.post("/tableData", async (req, res) => {
  //only unique
  const result = _.uniqWith(req.body, _.isEqual);
  //date is out of range of array
  const date = _.slice(result, result.length - 1, result.length);
  const tableData = _.slice(result, 0, result.length - 1);
  try {
    const tableDataDB = await TarifData.find({ date: date[0].date });

    if (tableDataDB.length > 0) {
      res.send("already saved");
    } else {
      const newTableData = new TarifData({
        date: date[0].date,
        tarifData: tableData
      });
      await newTableData.save();
      res.send("table Data saved");
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
  }
  // res.send("POST");
});
router.get("/", async (req, res) => {
  try {
    const tableData = await TarifData.find();
    res.json(tableData);
  } catch (e) {
    res.status(500).send("internal server error");
    console.error(e.message);
  }
});

module.exports = router;
