const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const exphbs = require("express-handlebars");
const path = require("path");
const fileUpload = require("express-fileupload");
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST, DELETE, OPTIONS",
  preflightContinue: true,
  optionsSuccessStatus: 204,
  exposedHeaders: "x-auth-token"
};
const app = express();
app.use(fileUpload());
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

connectDB();
app.use("/news", require("./routes/news"));
app.use("/docs", require("./routes/docs"));
app.set("views", path.join(__dirname, "views"));

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use("/docs/upload", function(request, response) {
  response.render("docs.handlebars");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on ${PORT}`));
