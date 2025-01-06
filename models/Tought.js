const mongoose = require("mongoose");

const User = require("./User");

const ToughtSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Tought = mongoose.model("Tought", ToughtSchema);

module.exports = Tought;
