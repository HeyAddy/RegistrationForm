const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/registration")
  .then(() => {
    console.log("Connected Succefully✌️...");
  })
  .catch(() => {
    console.log("No Connection Found");
  });
