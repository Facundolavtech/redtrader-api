require("dotenv").config();

const nms_config = {
  server: {
    secret: "kjVkuti2xAyF3JGCzSZTk0YWM5JhI9mgQW4rytXc",
  },
  rtmp_server: {
    logType: 1,
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30,
    },
    http: {
      port: 8882,
      mediaroot: "./lives/media",
      allow_origin: "*",
    },
    https: {
      port: 8443,
      key: './private.key',
      cert:'./www_redtrader-api_com.crt',
      passphrase: "",
    },
    auth: {
      play: true,
      api: true,
      publish: false,
      secret: "redtraderNMS2021",
      api_user: "nms_admin",
      api_pass: "lolpbe888",
    },
    trans: {
      ffmpeg: process.env.FFMPEG_PATH,
      tasks: [
        {
          app: "live",
          hls: true,
          hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
          dash: true,
          dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
        },
      ],
    },
  },
};

module.exports = nms_config;
