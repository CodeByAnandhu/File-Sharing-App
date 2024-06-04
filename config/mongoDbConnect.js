const mongoose = require("mongoose");

const MONGODB_URL = "mongodb://localhost:27017/cloudShare"; 

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

module.exports = mongoose;
