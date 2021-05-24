const NodeMediaServer = require("node-media-server");
const nms_config = require("../config/nms_config").rtmp_server;
const User = require("../models/User");

nms = new NodeMediaServer(nms_config);

nms.on("prePublish", async (id, StreamPath) => {
  const stream_key = await getStreamKeyFromStreamPath(StreamPath);

  await User.findOne({ educator_info: { stream_key } }, (err, user) => {
    if (!err) {
      if (!user || !user.roles.educator) {
        const session = nms.getSession(id);
        session.reject();
      } else {
        console.info(`Nueva transmision en vivo de: ${user.name}`);
      }
    }
  });

  return;
});

const getStreamKeyFromStreamPath = (path) => {
  let parts = path.split("/");
  return parts[parts.length - 1];
};

module.exports = nms;
