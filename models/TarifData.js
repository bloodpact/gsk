const mongoose = require("mongoose");

const TarifDataSchema = mongoose.Schema({
  date: { type: String },
  tarifData: [
    {
      infoName: { type: String },
      valueName: { type: String },
      amountOfServicesInfo: { type: String },
      summOfServicesInfo: { type: String }
    }
  ]
});

module.exports = mongoose.model("tarifData", TarifDataSchema);
