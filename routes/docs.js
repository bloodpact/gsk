const express = require("express");
const router = express.Router();
const Docs = require("../models/Docs");
const { google } = require("googleapis");
const drive = google.drive("v3");
const key = require("../private_key");

const jwToken = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ["https://www.googleapis.com/auth/drive"],
  null
);
jwToken.authorize(authErr => {
  if (authErr) {
    console.log(`err: ${authErr}`);
  } else {
    console.log("Auth success");
  }
});
const par = "1gFGHKj3DcMFb92vKpAo4ryVprVdJK2W9";
router.get("/", (req, res) => {
  return drive.files.list(
    {
      auth: jwToken,
      pageSize: 10,
      q: `'${par}' in parents and trashed=false`,
      fields: "files(name, webViewLink)"
    },
    (err, { data }) => {
      if (err) {
        console.log(err);
      }
      const files = data.files;
      const resMap = files.map(file => {
        return { name: file.name, link: file.webViewLink };
      });
      res.json(resMap);
    }
  );
});
// router.post("/", async (req, res) => {
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send("No files were uploaded.");
//   }
//   let sampleFile = req.files.fileName;
//   sampleFile.mv(path.join(__dirname, "../upload", sampleFile.name), function(
//     err
//   ) {
//     if (err) return res.status(500).send(err);
//   });
//
//   const { title } = req.body;
//   const link = path.join(__dirname, "../upload", sampleFile.name);
//   try {
//     const newDocs = new Docs({
//       title,
//       link
//     });
//     const contact = await newDocs.save();
//     res.json(contact);
//   } catch (e) {
//     console.error(e.message);
//     res.status(500).send("internal error");
//   }
// });
module.exports = router;
