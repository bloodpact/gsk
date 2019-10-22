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
router.get("/list", async (req, res) => {
  try {
    const news = await News.find({ news: req.body.title }).sort({
      date: -1
    });
    res.render("news", {
      news: news
    });
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
    const newsItem = await newNews.save();
    res.redirect("/news/list");
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
  }
});

router.post("/delete/:id", async (req, res) => {
  try {
    await News.findByIdAndRemove(req.params.id);
    res.redirect("/news/list");
  } catch (e) {
    res.status(500).send("internal server error");
    console.error(e.message);
  }
});
router.post("/update/:id", async (req, res) => {
  const { title, article } = req.body;
  try {
    await News.findByIdAndUpdate(req.params.id, {
      title: title,
      article: article
    });
    res.redirect("/news/list");
  } catch (e) {
    res.status(500).send("internal server error");
    console.error(e.message);
  }
});
module.exports = router;
