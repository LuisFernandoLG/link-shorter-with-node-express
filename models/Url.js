const mongoose = require("mongoose");
const { Schema } = mongoose;

const UrlSchema = new Schema({
  origin: {
    type: String,
    required: true,
  },
  shortedUrl: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Url = mongoose.model("Url", UrlSchema);
module.exports = Url;
