const nms_config = {
  server: {
    secret: "kjVkuti2xAyF3JGCzSZTk0YWM5JhI9mgQW4rytXc",
  },
  rtmp_server: {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30,
    },
    http: {
      port: 8882,
      allow_origin: "*",
    },
    trans: {
      ffmpeg: process.env.FFMPEG_PATH,
      tasks: [
        {
          app: "live",
          hls: true,
          dash: true,
        },
      ],
    },
    auth: {
      api: true,
      api_user: "admin",
      api_pass: "lolpbe888",
    },
  },
};

module.exports = nms_config;
