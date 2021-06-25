const NodeMediaServer = require("node-media-server");
const nms_config = require("../config/nms_config").rtmp_server;
const Educator = require("../models/Educator");

nms = new NodeMediaServer(nms_config);

nms.on("prePublish", async (id, StreamPath, params) => {
  await Educator.findOne({ stream_pw: params.stream_pw }, (err, educator) => {
    if (!err) {
      if (!educator || educator.stream_pw !== params.stream_pw) {
        const session = nms.getSession(id);
        session.reject();
      }
    }
  });

  return;
});

module.exports = nms;
