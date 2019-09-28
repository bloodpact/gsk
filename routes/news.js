const express = require("express");
const router = express.Router();

const News = require("../models/News");
router.get("/", async (req, res) => {
  try {
    const news = await News.find({ news: req.body.title }).sort({
      date: -1
    });
    res.json(news);
  } catch (e) {
    res.status(500).send("internal server error");
    console.error(e.message);
  }
});

router.post("/", async (req, res) => {
  const { title, article } = req.body;
  try {
    const newNews = new News({
      title,
      article
    });
    const contact = await newNews.save();
    res.json(contact);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
  }
});
module.exports = router;
