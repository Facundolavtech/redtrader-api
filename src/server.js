const express = require("express");
const app = express();
const fs = require("fs");
const http = require("http");
const https = require("https");
const cors = require("cors");
const cron = require("node-cron");
const RemoveExpiredPlans = require("./tasks/RemoveExpiredPlans");
const node_media_server = require("./nms/media_server");
require("./config/database");
require("dotenv").config();

const public_url =
  process.env.NODE_ENV == "production"
    ? "https://redtrader-api.com:9443"
    : "http://localhost:4000";

// Certificate
const key = fs.readFileSync('/etc/letsencrypt/live/redtrader-api.com/privkey.pem', 'utf8');
const cert = fs.readFileSync('/etc/letsencrypt/live/redtrader-api.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/redtrader-api.com/chain.pem', 'utf8');

const credentials = {
  key,
  cert,
  ca
};

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const io = require("socket.io")(httpsServer, {
  cors: {
    origin: [public_url],
  },
});

module.exports = function () {
  node_media_server.run();

  //Middlewares
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ extended: true }));

  let whitelist = ['https://www.redtraderacademy.com'];
  let corsOptions = {
  origin: '*',
  methods: '*',
  allowedHeaders: '*'
};

  cron.schedule("0 * * * *", function () {
    //Every 1 hour
    console.log("CRON: Deleting expired plans");
    RemoveExpiredPlans();
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
  app.use("/api/users/auth", cors(corsOptions), require("./routes/Users/auth"));

  //Admin Routes
  app.use("/api/admin",cors(corsOptions), require("./routes/Users/Admin"));

  //Confirm account & Reset Password Routes
  app.use(
    "/api/users/confirm", cors(corsOptions),
    require("./routes/Users/confirm")
  );
  app.use(
    "/api/users/password",
    cors(corsOptions),
    require("./routes/Users/password")
  );

  //Change password Route
  app.use(
    "/api/users/changePassword",
    cors(corsOptions),
    require("./routes/Users/changePassword")
  );

  //Update plan Routes
  app.use("/api/users/plan",cors(corsOptions), require("./routes/Users/plan"));

  //Videos Routes
  app.use("/api/videos",cors(corsOptions), require("./routes/videos"));

  //Coupons Routes
  app.use("/api/coupons", cors(corsOptions), require("./routes/coupons"));

  //Payments Routes
  app.use("/api/payments", cors(corsOptions), require("./routes/payments"));

  //Educator Route
  app.use(
    "/api/educator/settings",
    cors(corsOptions),
    require("./routes/Lives/settings")
  );

  //Lives Routes
  app.use(
    "/api/lives/streams",
   cors(corsOptions), 
   require("./routes/Lives/streams")
  );
  app.use(
    "/api/lives/educator",
    cors(corsOptions),
    require("./routes/Lives/educator")
  );

  // //Signals Routes
  app.use("/api/signals",cors(corsOptions), require("./routes/Signals"));

  app.use(
    "/api/users/notifications",
    cors(corsOptions),
    require("./routes/Notifications")
  );

  httpServer.listen(8080, () => {
    console.log('HTTP server on port 8080');
  });

  httpsServer.listen(9443, () => {
    console.log('HTTPS server on port 9443')
  })
};
