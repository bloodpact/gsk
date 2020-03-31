const mongoose = require("mongoose");
const UsersSchema = mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  oldPassword: {
    type: String,
    required: true
  },
  fio: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  taxData: [
    {
      date: String,
      debt: String,
      owner: String,
      place: String,
      summ: String,
      service: {
        serviceName: String,
        serviceAmount: String,
        serviceAmountTotal: String
      }
    }
  ]
});
module.exports = mongoose.model("users", UsersSchema);
