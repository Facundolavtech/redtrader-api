const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const RemoveExpiredPlans = require("./tasks/RemoveExpiredPlans");
const node_media_server = require("./nms/media_server");
const app = express();
const port = process.env.PORT || 4000;

require("./config/database");
require("dotenv").config();

module.exports = function () {
  node_media_server.run();

  //Middlewares
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ extended: true }));
  app.use(cors());

  cron.schedule("0 * * * *", function () {
    //Every 1 hour
    console.log("CRON: Deleting expired plans");
    RemoveExpiredPlans();
  });

  //Routes

  //Auth Routes
  app.use("/api/users/auth", require("./routes/Users/auth"));

  //Admin Routes
  app.use("/api/admin", require("./routes/Users/Admin"));

  //Confirm account & Reset Password Routes
  app.use("/api/users/confirm", require("./routes/Users/confirm"));
  app.use("/api/users/password", require("./routes/Users/password"));

  //Update plan Routes
  app.use("/api/users/plan", require("./routes/Users/plan"));

  //Videos Routes
  app.use("/api/videos", require("./routes/videos"));

  //Coupons Routes
  app.use("/api/coupons", require("./routes/coupons"));

  //Payments Routes
  app.use("/api/payments", require("./routes/payments"));

  //Educator Route
  app.use("/api/educator/settings", require("./routes/Lives/settings"));

  //Lives Routes
  app.use("/api/lives/streams", require("./routes/Lives/streams"));
  app.use("/api/lives/educator", require("./routes/Lives/educator"));

  app.listen(port, () => {
    console.log(`Server on port ${port}`);
  });
};
