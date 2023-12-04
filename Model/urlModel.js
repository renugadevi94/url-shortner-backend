const mongoose = require("mongoose");


// define a schema

const urlSchema = new mongoose.Schema({
  longurl: {
    type: String,
  },
  shorturl: {
    type: String,
    unique: true,
  },
  random: {
    type: String,
  },
  createdon: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// create a model
module.exports = mongoose.model("Url", urlSchema, "urls");