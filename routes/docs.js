const express = require("express");
const router = express.Router();
const path = require("path");
const Docs = require("../models/Docs");
router.post("/", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  let sampleFile = req.files.fileName;
  sampleFile.mv(path.join(__dirname, "../upload", sampleFile.name), function(
    err
  ) {
    if (err) return res.status(500).send(err);
  });

  const { title } = req.body;
  const link = path.join(__dirname, "../upload", sampleFile.name);
  try {
    const newDocs = new Docs({
      title,
      link
    });
    const contact = await newDocs.save();
    res.json(contact);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("internal error");
  }
});
module.exports = router;
