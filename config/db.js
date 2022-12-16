const mongoose = require("mongoose");
const serverData = require("./serverData");

const connectDB = async () => {
  try {
    await mongoose.connect(
      serverData.db,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      }
    );
    console.log("DB connected...");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
