const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const cron = require("node-cron");
const RemoveExpiredPlans = require("./tasks/RemoveExpiredPlans");
const node_media_server = require("./nms/media_server");
const ResetPartnerStats = require("./tasks/ResetPartnerStats");
require("./config/database");
require("dotenv").config();
const port = 9443;

// Certificate
const key = fs.readFileSync(
  "/etc/letsencrypt/live/redtrader-api.com/privkey.pem",
  "utf8"
);
const cert = fs.readFileSync(
  "/etc/letsencrypt/live/redtrader-api.com/cert.pem",
  "utf8"
);
const ca = fs.readFileSync(
  "/etc/letsencrypt/live/redtrader-api.com/chain.pem",
  "utf8"
);

const credentials = {
  key,
  cert,
  ca,
};

const httpsServer = https.createServer(credentials, app);

let io;

io = require("socket.io")(httpsServer, {
  cors: {
    origin: "*",
  },
});

module.exports = function () {
  node_media_server.run();

  //Middlewares
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ extended: true }));
  app.use(cors());

  cron.schedule("0 * * * *", function () {
    //Every 1 hour
    console.log("Executing cron tasks");

    RemoveExpiredPlans();
    ResetPartnerStats();
  });

  io.on("connection", (socket) => {
    let currentRoomId;

    socket.on("join_room", (room) => {
      socket.join(room);

      currentRoomId = room;

      io.to(room).emit("update_connections", {
        clients: io.sockets.adapter.rooms.get(room).size,
      });
    });

    socket.on("new_message", (room, name, short_id, message) => {
      io.to(room).emit("message", name, short_id, message);
    });

    socket.on("disconnecting", function () {
      if (currentRoomId) {
        io.to(currentRoomId).emit("update_connections", {
          clients: io.sockets.adapter.rooms.get(currentRoomId).size - 1,
        });
      }
    });

    socket.on("disconnect", () => {
      socket.removeAllListeners();
    });
  });

  //Routes

  //Auth Routes
  app.use("/api/users/auth", require("./routes/Users/auth.routes"));

  //Admin Routes
  app.use("/api/admin", require("./routes/Users/Admin/admin.routes"));

  //Confirm account & Reset Password Routes
  app.use("/api/users/confirm", require("./routes/Users/confirm.routes"));
  app.use("/api/users/password", require("./routes/Users/password.routes"));

  //Change password Route
  app.use(
    "/api/users/changePassword",
    require("./routes/Users/changePassword.routes")
  );

  //Update plan Routes
  app.use("/api/users/plan", require("./routes/Users/plan.routes"));

  //Videos Routes
  app.use("/api/videos", require("./routes/videos.routes"));

  //Coupons Routes
  app.use("/api/coupons", require("./routes/coupons.routes"));

  //Payments Routes
  app.use("/api/payments", require("./routes/payments.routes"));

  //Educator Route
  app.use("/api/educator/settings", require("./routes/Lives/settings.routes"));

  //Lives Routes
  app.use("/api/lives/streams", require("./routes/Lives/streams.routes"));
  app.use("/api/lives/educator", require("./routes/Lives/educator.routes"));
  app.use(
    "/api/lives/transmissions",
    cors(corsOptions),
    require("./routes/Lives/transmission.routes")
  );

  //Signals Routes
  app.use("/api/signals", require("./routes/Signals/signals.routes"));
  app.use(
    "/api/users/notifications",
    require("./routes/Notifications/notifications.routes")
  );

  //Partner Routes
  app.use("/api/users/partners", require("./routes/Users/partners.routes"));

  httpsServer.listen(port, () => {
    console.log(`HTTPS server on port ${port}`);
  });
};
