switch (process.env.NODE_ENV) {
  case "production":
    const httpsServer = require("./src/httpsServer");
    httpsServer();
    break;
  case "staging":
    const stagingServer = require("./src/stagingServer");
    stagingServer();
    break;
  default:
    const httpServer = require("./src/httpServer");
    httpServer();
}
