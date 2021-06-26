const { Router } = require("express");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const {
  generateStreamKey,
  getCredentials,
  generateStreamPassword,
} = require("../../controllers/lives/settings.controller");
const { educatorMiddleware } = require("../../middlewares/educator.middleware");

const router = Router();

//ROUTE
// api/educator/settings

router.get("/credentials", authMiddleware, educatorMiddleware, getCredentials);
router.post(
  "/stream_key",
  authMiddleware,
  educatorMiddleware,
  generateStreamKey
);
router.post(
  "/stream_pw",
  authMiddleware,
  educatorMiddleware,
  generateStreamPassword
);

module.exports = router;
