const User = require("../../models/User");
const Mailgun = require("mailgun-js");
require("dotenv").config();

exports.sendResetPasswordLink = async function (req, res) {
  const { email } = req.body;

  const findUserByEmail = await User.findOne({ email });
  if (!findUserByEmail) {
    return res
      .status(404)
      .send("No se encuentra un usuario registrado con ese correo");
  }

  const mg = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: "mg.redtrader.com",
  });

  const message = {
    from: "redtraderoficial@gmail.com",
    to: "facuhlavagninodq@gmail.com",
    subject: "Reestablecer contraseña de RedTrader",
    text: "Testing some Mailgun awesomness!",
  };

  mg.messages().send(message, function (error, body) {
    if (error) {
      console.log(error);
    } else {
      console.log(body);
      res.status(200).json({ msg: "Email enviado!" });
    }
  });

  try {
  } catch (error) {
    res.status(500).json({ msg: "Ocurrio un error" });
  }
};
