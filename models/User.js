const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    toughts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tought" }],
    sentMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }], 
    receivedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
