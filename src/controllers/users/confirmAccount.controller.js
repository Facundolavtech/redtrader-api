const ConfirmAccountToken = require("../../models/Confirm_Account_Token");
const User = require("../../models/User");
const { v4: uuidv4 } = require("uuid");
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

    if (findUserByEmail.confirmed === true) {
      return res.status(400).send("Ya tienes la cuenta confirmada");
    }

    const id = findUserByEmail._id;
    const token = uuidv4();

    const confirmToken = await new ConfirmAccountToken({ user: id, token });

    await confirmToken.save();

    const url = process.env.CLIENT_URL || "http://localhost:3000";

    const html = `<p style="color: #777;">Ingresa al siguiente enlace para confirmar tu cuenta</p><a href="${url}/confirm/params?id=${id}&token=${token}" style="padding: 10px 40px; background: #f50606; text-align: center; text-decoration: none; color: #fff; margin-top: 15px; border-radius: 10px; display: inline-block; font-weight: bold;">Confirmar Cuenta</a>`;

    const message = smtp_message(
      process.env.SMTP_USER,
      email,
      "Confirmar cuenta de RedTrader",
      html
    );

    await transport.sendMail(message, (err, info) => {
      if (err) return res.status(400).send("Ocurrio un error");
      return res.status(200).send("Email enviado con exito");
    });
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};

exports.confirm = async function (req, res) {
  const { id, token } = req.body;

  try {
    const findUserById = await User.findById(id);

    if (!findUserById) {
      return res.status(404).json("No se encontro un usuario");
    }

    const findToken = await ConfirmAccountToken.findOne({ token });

    if (!findToken) {
      return res
        .status(404)
        .json(
          "El token de confirmacion no existe o expiro, vuelve a enviar el correo"
        );
    }

    if (findToken.user != id) {
      return res
        .status(401)
        .json(
          "El token de confirmacion no existe o expiro, vuelve a enviar el correo"
        );
    }

    await User.findByIdAndUpdate(id, { confirmed: true });

    await ConfirmAccountToken.findOneAndRemove({ token });

    return res.status(200).send("Cuenta confirmada con exito");
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};

//Check if the user already has a confirmation token, to avoid sending another email
exports.getConfirmToken = async function (req, res) {
  const id = req.params.id;

  try {
    const findToken = await ConfirmAccountToken.findOne({ user: id });

    if (findToken) {
      return res.status(200).json();
    } else {
      return res.status(404).json();
    }
  } catch (error) {
    return res.status(500).json("Ocurrio un error");
  }
};
