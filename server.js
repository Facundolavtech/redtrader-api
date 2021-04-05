const express = require("express");
const app = express();
const cors = require("cors");

require("./src/config/database");
require("dotenv").config();

module.exports = function () {
  app.use(express.json());
  app.use(cors());
  const port = process.env.PORT || 4000;

  app.use("/api/users", require("./src/routes/users"));
  app.use("/api/videos", require("./src/routes/videos"));

  app.listen(port, () => {
    console.log(`Server on port ${port}`);
  });
};
