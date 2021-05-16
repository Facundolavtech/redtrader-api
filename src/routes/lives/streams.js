const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/user.middleware");
const { getStreams } = require("../../controllers/lives/streams");

const router = Router();

router.get("/info", authMiddleware, getStreams);

module.exports = router;
