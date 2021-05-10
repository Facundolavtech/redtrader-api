const Coupon = require("../../models/Coupon");
const User = require("../../models/User");

exports.createCoupon = async function (req, res) {
  const data = req.body;

  try {
    const findCoupon = await Coupon.findOne({ coupon_name: data.coupon_name });

    if (findCoupon) {
      return res.status(400).json("Ya existe un cupon con ese nombre");
    }

    const newCoupon = await new Coupon(data);

    await newCoupon.save();

    return res.status(200).json("Cupon creado con exito");
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};

exports.deleteCoupon = async function (req, res) {
  try {
    const couponId = req.params.couponId;
    await Coupon.findByIdAndRemove(couponId);

    return res.status(200).json("Cupon eliminado con exito");
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};

exports.applyCoupon = async function (req, res) {
  try {
    const id = req.user.id;
    const { coupon_name } = req.body;

    const findUserById = await User.findById(id);

    if (!findUserById) {
      return res.status(404).json("Debes iniciar sesion para continuar");
    }

    if (findUserById.discount.active === true) {
      return res.status(400).json("Ya tienes un cupon activo");
    }

    const findCoupon = await Coupon.findOne({ coupon_name });

    if (!findCoupon) {
      return res.status(404).json("No se encontro ningun cupon con ese nombre");
    }

    await User.findByIdAndUpdate(id, {
      discount: {
        active: true,
        percent: findCoupon.discount,
        coupon_name: findCoupon.coupon_name,
      },
    });

    await Coupon.findOneAndRemove({ coupon_name });

    return res.status(200).json("Cupon aplicado");
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};

exports.getAllCoupons = async function (req, res) {
  try {
    const allCoupons = await Coupon.find({});

    return res.status(200).json({ coupons: allCoupons });
  } catch (error) {
    return res.status(500).send("Ocurrio un error");
  }
};
