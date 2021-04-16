const User = require("../../models/User");
const { v4: uuidv4 } = require("uuid");
const ForgotPwToken = require("../../models/ForgotPasswordToken");
require("dotenv").config();
const nodemailer = require("nodemailer");

exports.sendResetPasswordEmail = async function (req, res) {
  const { email } = req.body;

  try {
    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return res
        .status(404)
        .send("No se encontro ningun usuario registrado con ese correo");
    }

    const userId = findUserByEmail._id;
    const token = uuidv4();

    const forgotToken = await new ForgotPwToken({ userId, token });

    forgotToken.save();

    const transport = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      auth: {
        user: "redtraderoficial@gmail.com",
        pass: "BVF2jrhJvzLkRXGP",
      },
    });

    const url = process.env.clientURL;

    const message = {
      from: "redtraderoficial@gmail.com",
      to: email,
      subject: "Reestablecer contraseña de RedTrader",
      html: `<p style="color: #777;">Ingresa al siguiente enlace para cambiar tu contraseña</p><a href="${url}/resetpassword/params?id=${userId}&token=${token}" style="padding: 10px 40px; background: #f50606; text-align: center; text-decoration: none; color: #fff; margin-top: 15px; border-radius: 10px; display: inline-block; font-weight: bold;">Reestablecer contraseña</a>`,
    };

    await transport.sendMail(message, (err, info) => {
      if (err) return res.status(400).send("Ocurrio un error");
      return res.status(200).send("Email enviado con exito");
    });
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};
