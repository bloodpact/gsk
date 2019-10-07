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
router.get("/", async (req, res) => {
  try {
    const parentDataRes = await drive.files.list({
      auth: jwToken,
      pageSize: 100,
      q: `'${parent}' in parents and trashed=false`,
      fields: "files(id, name, webViewLink)"
    });
    const parentData = parentDataRes.data.files;
    const childData = parentData.map(async el => {
      return {
        child: await drive.files.list({
          auth: jwToken,
          pageSize: 100,
          q: `'${el.id}' in parents and trashed=false`,
          fields: "files(id, name, webViewLink)"
        }),
        parent: el
      };
    });
    Promise.all(childData).then(resp => res.json(resp));
    // res.json(parentData);
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
