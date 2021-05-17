const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const deletePlan = require("../src/tasks/deletePlan");
const node_media_server = require("./nms/media_server");

require("./config/database");
require("dotenv").config();

const https = require('https');
const fs = require('fs')
const key = fs.readFileSync(__dirname + '/../private.key');
const cert = fs.readFileSync(__dirname + '/../certificate.crt');
const options = {
  key: key,
  cert: cert
};

const app = express();

const server = https.createServer(options, app);

module.exports = function () {

  node_media_server.run();

  //Middlewares
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ extended: true }));
  app.use(cors());
  const port = process.env.PORT || 9443;

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

  //Run server
  server.listen(port, () => {
    console.log(`Server on port ${port}`);
  });
};
