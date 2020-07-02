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
  newPassword: {
    type: String
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
      QR: String,
      service: {
        serviceName: String,
        serviceAmount: String,
        serviceAmountTotal: String
      }
    }
  ]
});
module.exports = mongoose.model("users", UsersSchema);
