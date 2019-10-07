const express = require("express");
const router = express.Router();
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
const parent = "1gFGHKj3DcMFb92vKpAo4ryVprVdJK2W9";
router.get("/", (req, res) => {
  return drive.files.list(
    {
      auth: jwToken,
      pageSize: 100,
      q: `'${parent}' in parents and trashed=false`,
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
module.exports = router;
