const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  userName: {
    type: String,
    lowercase: true,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokenConfirm: {
    type: String,
    default: null,
  },
  isCountConfirm: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: null,
  },
});

//

UserSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    console.log(error.message);
    next();
  }
});

UserSchema.methods.comparePassword = async function ({ candidatePass }) {
  return await bcrypt.compare(candidatePass, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
