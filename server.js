const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const exphbs = require("express-handlebars");
const CryptoJS = require("crypto-js");
const path = require("path");
const session = require("express-session");
const fileUpload = require("express-fileupload");

const serverData = require("./config/serverData");


const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST, DELETE, OPTIONS",
  preflightContinue: true,
  optionsSuccessStatus: 204,
  exposedHeaders: "x-auth-token",
};

const app = express();

app.use(fileUpload());
app.use(express.json({ limit: "10mb", extended: true }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors(corsOptions));
app.use(
  session({
    secret: "hello kitty",
    resave: false,
    saveUninitialized: false,
  })
);

connectDB();

app.use("/news", require("./routes/news"));
app.use("/users", require("./routes/users"));
app.use("/docs", require("./routes/docs"));
app.use("/data", require("./routes/dataTable"));
app.use("/email", require("./routes/mail"));
app.use("/rates", require("./routes/rates"));
app.set("views", path.join(__dirname, "views"));

app.engine("handlebars", exphbs());

app.set("view engine", "handlebars");

app.post("/", async (req, res) => {
  const originalPass = CryptoJS.AES.decrypt(
    serverData.crypto,
    serverData.secretCrypto
  ).toString(CryptoJS.enc.Utf8);
  
  if (req.body.log === originalPass) {
    req.session.logged = true;
    req.session.save((err) => {
      console.log(err);
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

app.get("/", (req, res) => {
  res.render("index", { logged: req.session.logged });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`server started on ${PORT}`));
