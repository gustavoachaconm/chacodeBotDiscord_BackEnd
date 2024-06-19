const mongoose = require("mongoose");

const bannedUserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  guildId: { type: String, required: true },
  guildName: { type: String, required: true },
  banType: { type: String, enum: ["TEMP", "PERM"], required: true },
  unbanTime: { type: Number },
});

const BannedUser = mongoose.model("BannedUser", bannedUserSchema);

module.exports = { BannedUser };
