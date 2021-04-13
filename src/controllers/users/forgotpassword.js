const User = require("../../models/User");
const Mailgun = require("mailgun-js");
require("dotenv").config();
const nodemailer = require("nodemailer");

// exports.sendResetPasswordLink = async function (req, res) {
//   const { email } = req.body;

//   const findUserByEmail = await User.findOne({ email });
//   if (!findUserByEmail) {
//     return res
//       .status(404)
//       .send("No se encuentra un usuario registrado con ese correo");
//   }

//   const mg = new Mailgun({
//     apiKey: process.env.MAILGUN_API_KEY,
//     domain: "mg.redtrader.com",
//   });

//   const message = {
//     from: "redtraderoficial@gmail.com",
//     to: "facuhlavagninodq@gmail.com",
//     subject: "Reestablecer contraseña de RedTrader",
//     text: "Testing some Mailgun awesomness!",
//   };

//   mg.messages().send(message, function (error, body) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log(body);
//       res.status(200).json({ msg: "Email enviado!" });
//     }
//   });

//   try {
//   } catch (error) {
//     res.status(500).json({ msg: "Ocurrio un error" });
//   }
// };

exports.sendResetPasswordLink = async function (req, res) {
  try {
    const transport = nodemailer.createTransport({
      host: "email-smtp.sa-east-1.amazonaws.com",
      port: 587,
      // secure: true, // use TLS
      auth: {
        user: "AKIA3OHQJUXUIXD3IHCM",
        pass: "BGujrlYEQkYO19OwudvZfI9+3xUoYEqtiUI3mgRbzRls",
      },
      // tls: {
      //   // do not fail on invalid certs
      //   rejectUnauthorized: false,
      // },
    });

    const message = {
      from: "redtraderoficial@gmail.com",
      to: "redtraderoficial@gmail.com",
      subject: "Recuperar contraseña",
      html:
        "<p>Ingresa al siguiente enlace para cambiar tu contraseña, <strong>https://localhost:3000/iawdiawbnuidbad/diwandianbd</strong></p><br>",
    };

    transport.sendMail(message, (err, info) => {
      if (err) console.log(err);
      console.log(info);
      return res.status(200).send(info);
    });
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrio un error" });
  }
};
