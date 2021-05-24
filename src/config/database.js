const { connect } = require("mongoose");
require("dotenv").config();

module.exports = (async () => {
  connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/redtrader-api",
    {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  ).then((connection) => {
    console.log("Database is connected to", connection.connections[0].name);
  });
})();
