const express = require("express");
const app = express();
const fs = require("fs");
const http = require("http");
const https = require("https");
const cors = require("cors");
const cron = require("node-cron");
const RemoveExpiredPlans = require("./tasks/RemoveExpiredPlans");
const node_media_server = require("./nms/media_server");
const ResetPartnerStats = require("./tasks/ResetPartnerStats");
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
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = function () {
  node_media_server.run();

  //Middlewares
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ extended: true }));

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
  app.use(
    "/api/users/auth",
    cors(corsOptions),
    require("./routes/Users/auth.routes")
  );

  //Admin Routes
  app.use(
    "/api/admin",
    cors(corsOptions),
    require("./routes/Users/Admin/admin.routes")
  );

  //Confirm account & Reset Password Routes
  app.use(
    "/api/users/confirm",
    cors(corsOptions),
    require("./routes/Users/confirm.routes")
  );
  app.use(
    "/api/users/password",
    cors(corsOptions),
    require("./routes/Users/password.routes")
  );

  //Change password Route
  app.use(
    "/api/users/changePassword",
    cors(corsOptions),
    require("./routes/Users/changePassword.routes")
  );

  //Update plan Routes
  app.use(
    "/api/users/plan",
    cors(corsOptions),
    require("./routes/Users/plan.routes")
  );

  //Videos Routes
  app.use("/api/videos", cors(corsOptions), require("./routes/videos.routes"));

  //Coupons Routes
  app.use(
    "/api/coupons",
    cors(corsOptions),
    require("./routes/coupons.routes")
  );

  //Payments Routes
  app.use(
    "/api/payments",
    cors(corsOptions),
    require("./routes/payments.routes")
  );

  //Educator Route
  app.use(
    "/api/educator/settings",
    cors(corsOptions),
    require("./routes/Lives/settings.routes")
  );

  //Lives Routes
  app.use(
    "/api/lives/streams",
    cors(corsOptions),
    require("./routes/Lives/streams.routes")
  );
  app.use(
    "/api/lives/educator",
    cors(corsOptions),
    require("./routes/Lives/educator.routes")
  );

  //Signals Routes
  app.use(
    "/api/signals",
    cors(corsOptions),
    require("./routes/Signals/signals.routes")
  );
  app.use(
    "/api/users/notifications",
    cors(corsOptions),
    require("./routes/Notifications/notifications.routes")
  );

  //Partner Routes
  app.use(
    "/api/users/partners",
    cors(corsOptions),
    require("./routes/Users/partners.routes")
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
