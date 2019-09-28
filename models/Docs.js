const mongoose = require("mongoose");
const DocsSchema = mongoose.Schema({
  news: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "news"
  },
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("docs", DocsSchema);
