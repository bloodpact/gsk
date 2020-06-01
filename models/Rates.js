const mongoose = require("mongoose");
const RatesSchema = mongoose.Schema({
  month: {
    type: String,
    required: true
  },
  sum: {
    type: String,
    required: true
  },
  query: {
    type: Number
  }
});

module.exports = mongoose.model("rate", RatesSchema);
