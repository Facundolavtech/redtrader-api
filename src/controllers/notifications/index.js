const User = require("../../models/User");
const { Expo } = require("expo-server-sdk");
require("dotenv").config();
const fetch = require("node-fetch");
const Plan = require("../../models/Plan");

const accessToken = process.env.NOTIFICATIONS_TOKEN;

exports.saveToken = async function (req, res) {
  try {
    const { id } = req.user;

    const { token } = req.body;

    const findUserById = await User.findById(id);

    if (!findUserById) {
      return res
        .status(404)
        .json("Ocurrio un error inesperado, intentalo nuevamente");
    }

    if (typeof findUserById.notifications_token === "undefined") {
      return res.status(400).json();
    }

    if (findUserById.notifications_token.includes(token)) {
      return res.status(400).json();
    }

    const newTokenList = [...findUserById.notifications_token, token];

    await User.updateOne({ _id: id }, { notifications_token: newTokenList });

    return res.status(200).json("Token guardado");
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.sendToAll = async function (req, res) {
  try {
    const { market } = req.body;

    const getUsers = await User.find({ plan: { $ne: null } });

    const tokenList = [];

    for (let user of getUsers) {
      if (
        typeof user.notifications_token === "undefined" ||
        user.notifications_token === []
      ) {
        continue;
      }

      const planInfo = await Plan.findOne({ _id: user.plan });

      if (planInfo.type !== "premium_plus" && market === "Acciones") {
        continue;
      }

      tokenList.push(...user.notifications_token);
    }

    let tokenListFiltered = tokenList.filter((token, index) => {
      return tokenList.indexOf(token) === index;
    });

    let messages = [];

    for (const token of tokenListFiltered) {
      if (!Expo.isExpoPushToken(token)) {
        continue;
      }

      messages.push({
        to: token,
        sound: "default",
        title: `Nueva señal de ${market}`,
        body: "¡Ingresa ahora!",
      });
    }

    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      body: JSON.stringify(messages),
      headers: {
        "Content-Type": "application/json",
        host: "exp.host",
        Accept: "application/json",
        "Accept-encoding": "gzip,deflate",
        Authorization: String("Bearer").concat(" ", accessToken),
      },
    })
      .then(() => {
        return res.status(200).json("Señal enviada");
      })
      .catch(() => {
        return res
          .status(400)
          .json(
            "Ocurrio un error al enviar la señal, intentalo de nuevo, si el problema persiste contacta con soporte"
          );
      });
  } catch (error) {
    return res.status(500).json(error);
  }
};
