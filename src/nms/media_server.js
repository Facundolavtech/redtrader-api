const NodeMediaServer = require("node-media-server");
const nms_config = require("../config/nms_config").rtmp_server;
const User = require("../models/User");

nms = new NodeMediaServer(nms_config);

nms.on("prePublish", async (id, StreamPath) => {
  let stream_key = await getStreamKeyFromStreamPath(StreamPath);

  User.findOne({ stream_key }, (err, user) => {
    if (!err) {
      if (!user.role_educator) {
        let session = nms.getSession(id);
        session.reject();
      } else {
        console.log(`Esta transmitiendo: ${user.name}`);
      }
    }
  });

  console.log("Node media server:", `id=${id} StreamPath=${StreamPath}`);
  return;
});

const getStreamKeyFromStreamPath = (path) => {
  let parts = path.split("/");
  return parts[parts.length - 1];
};

module.exports = nms;
