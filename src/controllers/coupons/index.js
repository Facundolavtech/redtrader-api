const Coupon = require("../../models/Coupon");
const User = require("../../models/User");

exports.createCoupon = async function (req, res) {
  try {
    const data = req.body;
    const { name } = data;

    const findCoupon = await Coupon.findOne({ name });

    if (findCoupon) {
      return res.status(400).json("Ya existe un cupon con ese nombre");
    }

    const newCoupon = await new Coupon(data);

    await newCoupon.save({ forceServerObjectId: true });

    return res.status(200).json("Cupon creado");
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};

exports.deleteCoupon = async function (req, res) {
  try {
    const couponId = req.params.couponId;

    const findCoupon = await Coupon.findById(couponId);

    if (!findCoupon) {
      return res.status(404).send("El cupon no existe");
    } else {
      findCoupon.delete().then(() => {
        return res.status(200).json("Cupon eliminado");
      });
    }
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};

exports.applyCoupon = async function (req, res) {
  try {
    const { id } = req.user;
    const { name } = req.body;

    const findUserById = await User.findById(id);

    if (!findUserById) {
      return res.status(404).json("Inicia sesion para continuar");
    }

    if (findUserById.coupon) {
      return res.status(400).json("Ya tienes un cupon activo");
    }

    const findCoupon = await Coupon.findOne({ name });

    if (!findCoupon) {
      return res.status(404).json("No se encontro ningun cupon con ese nombre");
    }

    await User.findByIdAndUpdate(id, {
      coupon: { discount: findCoupon.discount, name: findCoupon.name },
    });

    await Coupon.findOneAndRemove({ name });

    return res.status(200).json("Cupon aplicado");
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};

exports.getCoupons = async function (req, res) {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: "desc" });

    return res.status(200).json(coupons);
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};
