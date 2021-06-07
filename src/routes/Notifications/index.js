const { Router } = require("express");
const { saveToken, sendToAll } = require("../../controllers/notifications");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { educatorMiddleware } = require("../../middlewares/educator.middleware");

const router = Router();

//api/users/notifications

router.post("/token/save", authMiddleware, saveToken);
router.post("/sendtoall", authMiddleware, educatorMiddleware, sendToAll);

module.exports = router;
