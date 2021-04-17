const express = require("express");
const app = express();
const cors = require("cors");
const cron = require("node-cron");
const deletePlan = require("../src/tasks/deletePlan");

require("./config/database");
require("dotenv").config();

module.exports = function () {
  //Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  const port = process.env.PORT || 4000;

  cron.schedule("* * * *", function () {
    console.log("Deleting expire plans");
    deletePlan();
  });

  //Routes
  app.use("/api/users", require("./routes/users"));
  app.use("/api/videos", require("./routes/videos"));
  app.use("/payhook", require("./routes/payhook"));
  app.use("/api/pays", require("./routes/pays"));

  //Run server
  app.listen(port, () => {
    console.log(`Server on port ${port}`);
  });
};
