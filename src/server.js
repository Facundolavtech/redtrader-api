const express = require("express");
const app = express();
const http = require("http");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const cron = require("node-cron");
const RemoveExpiredPlans = require("./tasks/RemoveExpiredPlans");
const node_media_server = require("./nms/media_server");
const port = process.env.PORT || 4000;
require("./config/database");
require("dotenv").config();

const public_url =
  process.env.NODE_ENV == "production"
    ? "https://redtrader-api.com:9443"
    : "http://localhost:4000";

let server;

if (process.env.NODE_ENV === "production") {
  server = https.createServer(
    {
      key: fs.readFileSync(__dirname + "/../private.key"),
      cert: fs.readFileSync(__dirname + "/../www_redtrader-api_com.crt"),
    },
    app
  );
} else {
  server = http.createServer(app);
}

const io = require("socket.io")(server, {
  cors: {
    origin: [public_url],
  },
});

let whitelist = ['https://www.redtraderacademy.com', 'exp://g9-c55.facuh1999.redtrader-mobile.exp.direct:80'];
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  allowedHeaders: ["*"],
};

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
  app.use("/api/users/auth", require("./routes/Users/auth"));

  //Admin Routes
  app.use("/api/admin", require("./routes/Users/Admin"));

  //Confirm account & Reset Password Routes
  app.use(
    "/api/users/confirm",
    require("./routes/Users/confirm")
  );
  app.use(
    "/api/users/password",
    require("./routes/Users/password")
  );

  //Change password Route
  app.use(
    "/api/users/changePassword",
    require("./routes/Users/changePassword")
  );

  //Update plan Routes
  app.use("/api/users/plan", require("./routes/Users/plan"));

  //Videos Routes
  app.use("/api/videos", require("./routes/videos"));

  //Coupons Routes
  app.use("/api/coupons", require("./routes/coupons"));

  //Payments Routes
  app.use("/api/payments", require("./routes/payments"));

  //Educator Route
  app.use(
    "/api/educator/settings",
    require("./routes/Lives/settings")
  );

  //Lives Routes
  app.use(
    "/api/lives/streams",
    require("./routes/Lives/streams")
  );
  app.use(
    "/api/lives/educator",
    require("./routes/Lives/educator")
  );

  // //Signals Routes
  app.use("/api/signals", require("./routes/Signals"));

  app.use(
    "/api/users/notifications",
    require("./routes/Notifications")
  );

  server.listen(port, () => {
    console.log(`Server on port ${port}`);
  });
};
