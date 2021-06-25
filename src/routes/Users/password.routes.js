const { Router } = require("express");
const router = Router();

const { sendEmail } = require("../../controllers/users/forgotpw.controller");
const { resetPassword } = require("../../controllers/users/resetpw.controller");

//ROUTE
// /api/users/password

router.post("/forgot", sendEmail);
router.post("/reset", resetPassword);

module.exports = router;
