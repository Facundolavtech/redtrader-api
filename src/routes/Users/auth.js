const { Router } = require("express");

const {
  register,
  login,
  auth,
  updateUser,
} = require("../../controllers/users");

const { authMiddleware } = require("../../middlewares/auth.middleware");

const router = Router();

//ROUTE:
// api/users/auth/

router.post("/register", register);
router.post("/login", login);
router.get("/", authMiddleware, auth);
router.put("/:id", authMiddleware, updateUser);

module.exports = router;
