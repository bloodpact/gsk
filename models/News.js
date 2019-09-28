const mongoose = require("mongoose");

const NewsSchema = mongoose.Schema({
  news: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "news"
  },
  title: {
    type: String,
    required: true
  },
  article: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("news", NewsSchema);
