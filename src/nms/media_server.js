const NodeMediaServer = require("node-media-server");
const nms_config = require("../config/nms_config").rtmp_server;
const User = require("../models/User");

nms = new NodeMediaServer(nms_config);

// nms.on("donePublish", (id, StreamPath, args) => {
//   console.log(
//     "[NodeEvent on donePublish]",
//     `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
//   );
// });

nms.on("prePublish", async (id, StreamPath, params) => {
  await User.findOne({ stream_pw: params.stream_pw }, (err, user) => {
    if (!err) {
      if (
        !user ||
        user.stream_pw !== params.stream_pw ||
        !user.roles.educator
      ) {
        const session = nms.getSession(id);
        session.reject();
      }
    }
  });

  return;
});

module.exports = nms;
