const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { getStreams } = require("../../controllers/lives/streams.controller");
const { getEducators } = require("../../controllers/lives/educator.controller");

const router = Router();

//ROUTE
// api/lives/streams

router.get("/info", authMiddleware, getStreams);
router.get("/educators", authMiddleware, getEducators);

module.exports = router;
