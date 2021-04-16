const express = require("express");
const app = express();
const cors = require("cors");

require("./src/config/database");
require("dotenv").config();

module.exports = function () {
  const port = process.env.PORT || 4000;

  //Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  //Routes
  app.use("/api/users", require("./src/routes/users"));
  app.use("/api/videos", require("./src/routes/videos"));
  app.use("/payhook", require("./src/routes/payhook"));
  app.use("/api/pays", require("./src/routes/pays"));

  //Run server
  app.listen(port, () => {
    console.log(`Server on port ${port}`);
  });
};
