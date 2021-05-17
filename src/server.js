const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const cron = require("node-cron");
const deletePlan = require("../src/tasks/deletePlan");
const node_media_server = require("./nms/media_server");
const app = express();
const port = process.env.PORT || 4001;

require("./config/database");
require("dotenv").config();

const key = fs.readFileSync(__dirname + "/../private.key");
const cert = fs.readFileSync(__dirname + "/../certificate.crt");
const options = {
  key: key,
  cert: cert,
};

module.exports = function () {
  const server = https.createServer(options, app);

  node_media_server.run();

  //Middlewares
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ extended: true }));
  app.use(cors());

  cron.schedule("0 * * * *", function () {
    console.log("Deleting expire plans");
    deletePlan();
  });

  //Routes
  app.use("/api/users", require("./routes/users"));
  app.use("/api/videos", require("./routes/videos"));
  app.use("/payhook", require("./routes/payhook"));
  app.use("/api/pays", require("./routes/pays"));
  app.use("/api/coupons", require("./routes/coupons"));
  app.use("/api/educator/settings", require("./routes/lives/settings"));
  app.use("/api/lives/streams", require("./routes/lives/streams"));
  app.use("/api/lives/educator", require("./routes/lives/educator"));

  server.listen(port, () => {
    console.log(`Server on port ${port}`);
  });
};
