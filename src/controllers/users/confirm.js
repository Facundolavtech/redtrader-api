const ConfirmAccountToken = require("../../models/ConfirmAccountToken");
const User = require("../../models/User");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

exports.sendConfirmPasswordEmail = async function (req, res) {
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

    const confirmToken = await new ConfirmAccountToken({ userId, token });

    confirmToken.save();

    const transport = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      auth: {
        user: "redtraderoficial@gmail.com",
        pass: "BVF2jrhJvzLkRXGP",
      },
    });

    const url = "https://redtraderacademy.com";

    const message = {
      from: "redtraderoficial@gmail.com",
      to: email,
      subject: "Confirmar cuenta de RedTrader",
      html: `<p style="color: #777;">Ingresa al siguiente enlace para confirmar tu cuenta</p><a href="${url}/confirm/params?id=${userId}&token=${token}" style="padding: 10px 40px; background: #f50606; text-align: center; text-decoration: none; color: #fff; margin-top: 15px; border-radius: 10px; display: inline-block; font-weight: bold;">Confirmar Cuenta</a>`,
    };

    await transport.sendMail(message, (err, info) => {
      if (err) return res.status(400).send("Ocurrio un error");
      return res.status(200).send("Email enviado con exito");
    });
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};

exports.confirmAccount = async function (req, res) {
  const { id, token } = req.body;

  try {
    const findUserById = await User.findById(id);

    if (!findUserById) {
      return res.status(404).send("No se encontro un usuario");
    }

    const findToken = await ConfirmAccountToken.findOne({ token });

    if (!findToken) {
      return res
        .status(404)
        .send(
          "El token para confirmar la cuenta no existe o expiro, porfavor vuelve a enviar nuevamente el correo"
        );
    }

    if (findToken.userId != id) {
      return res
        .status(401)
        .send(
          "El token para confirmar la cuenta no existe o expiro, porfavor vuelve a enviar nuevamente el correo"
        );
    }

    await User.findByIdAndUpdate(id, { confirmed: true });

    await ConfirmAccountToken.findOneAndRemove({ token });

    return res.status(200).send("Cuenta confirmada con exito");
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};

exports.getConfirmToken = async function (req, res) {
  const userId = req.params.id;
  try {
    const findToken = await ConfirmAccountToken.findOne({ userId });

    if (!findToken) {
      return res.status(200).send();
    } else {
      return res.status(400).send();
    }
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};
