const User = require("../../models/User");
const { v4: uuidv4 } = require("uuid");
const ForgotPwToken = require("../../models/Forgot_Password_Token");
const transport = require("../../utils/smtp_transport");
const smtp_message = require("../../utils/smtp_message");

exports.sendEmail = async function (req, res) {
  const { email } = req.body;

  try {
    const findUserByEmail = await User.findOne({ email });

    if (!findUserByEmail) {
      return res
        .status(404)
        .send("No se encontro ningun usuario registrado con ese correo");
    }

    const id = findUserByEmail._id;

    const findTokenById = await ForgotPwToken.findOne({
      user: id,
    });

    if (findTokenById) {
      return res
        .status(200)
        .send(
          "Ya enviaste el correo de confirmacion, espera antes de enviar uno nuevo"
        );
    }

    const token = uuidv4();

    const forgotToken = await new ForgotPwToken({ user: id, token });

    await forgotToken.save();

    const url = process.env.CLIENT_URL || "http://localhost:3000";

    const html = `<p style="color: #777;">Ingresa al siguiente enlace para cambiar tu contraseña</p><a href="${url}/resetpassword/params?id=${id}&token=${token}" style="padding: 10px 40px; background: #f50606; text-align: center; text-decoration: none; color: #fff; margin-top: 15px; border-radius: 10px; display: inline-block; font-weight: bold;">Reestablecer contraseña</a>`;

    const message = smtp_message(
      process.env.SMTP_USER,
      email,
      "Reestablecer contraseña de RedTrader",
      html
    );

    await transport.sendMail(message, (err, info) => {
      if (err) return res.status(400).send("Ocurrio un error");
      return res
        .status(200)
        .send("Email de recuperacion de contraseña enviado");
    });
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
