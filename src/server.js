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

let httpsServer;
let httpServer;

if (process.env.NODE_ENV === "production") {
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
  httpsServer = https.createServer(credentials, app);
} else {
  httpServer = http.createServer(app);
}

let io;

if (process.env.NODE_ENV === "production") {
  io = require("socket.io")(httpsServer, {
    cors: {
      origin: [public_url],
    },
  });
} else {
  io = require("socket.io")(httpServer, {
    cors: {
      origin: [public_url],
    },
  });
}

let whitelist = ["https://www.redtraderacademy.com"];
let corsOptions = {
  // origin: function (origin, callback) {
  //   if (whitelist.indexOf(origin) !== -1 || !origin) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // },
  origin: "*",
  allowedHeaders: ["*"],
};

module.exports = function () {
  node_media_server.run();

  //Middlewares
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ extended: true }));

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
  app.use("/api/admin", cors(corsOptions), require("./routes/Users/Admin"));

  //Confirm account & Reset Password Routes
  app.use(
    "/api/users/confirm",
    cors(corsOptions),
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
  app.use("/api/users/plan", cors(corsOptions), require("./routes/Users/plan"));

  //Videos Routes
  app.use("/api/videos", cors(corsOptions), require("./routes/videos"));

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

  //Signals Routes
  app.use("/api/signals", cors(corsOptions), require("./routes/Signals"));
  app.use(
    "/api/users/notifications",
    cors(corsOptions),
    require("./routes/Notifications")
  );

  //Partner Routes
  app.use(
    "/api/users/partners",
    cors(corsOptions),
    require("./routes/Users/partners")
  );

  if (process.env.NODE_ENV === "production") {
    httpsServer.listen(9443, () => {
      console.log("HTTPS server on port 9443");
    });
  } else {
    httpServer.listen(4000, () => {
      console.log("HTTP server on port 4000");
    });
  }
};
