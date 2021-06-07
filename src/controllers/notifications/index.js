const User = require("../../models/User");
const { Expo } = require("expo-server-sdk");

let expo = new Expo();

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

    if (!findUserById.plan.active) {
      return res
        .status(401)
        .json("Necesitas un plan para recibir señales de RedTrade");
    }

    if (findUserById.notifications_token.includes(token)) {
      return res.status(400).json("Ya existe ese token en tu cuenta");
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

    const getUsers = await User.find({ "plan.active": true });

    const tokenList = [];

    for (let user of getUsers) {
      if (
        user.notifications_token === undefined ||
        user.notifications_token === []
      ) {
        continue;
      }

      if (!user.plan.plan_type.premium_plus && market === "Acciones") {
        continue;
      }

      tokenList.push(...user.notifications_token);
    }

    let messages = [];

    for (const token of tokenList) {
      messages.push({
        to: token,
        sound: "default",
        title: `Nueva señal de ${market}`,
        body: "¡Ingresa ahora!",
      });
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
        } catch (error) {
          return;
        }
      }
    })();

    res.status(200).json();
  } catch (error) {
    return res.status(500).json(error);
  }
};
