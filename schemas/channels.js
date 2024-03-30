const { Schema, model } = require("mongoose");
const channelArray = new Schema({
  _id: Schema.Types.ObjectId,
  channelId: String,
  type: String,
  index: { type: Number, default: 1 }
});

module.exports = new model("Channels", channelArray, "channels");