const mongoose = require("mongoose");
require("dotenv").config()

const clientDb = mongoose
  .connect(process.env.URI, {})
  .then((m) => {
    console.log("BD connected! ✔✔✔");
    return m.connection.getClient()
  })
  .catch((e) => {
    console.log("Something went wrong with DB" + e);
  });

  module.exports = clientDb