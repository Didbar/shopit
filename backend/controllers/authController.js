const User = require("../models/user");

const errorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//Register the user  => /api/v1/register

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "avatars/3268560e74a0f0f8f6070c3651d9342d_cefhnu",
      url:
        "https://res.cloudinary.com/doxyiccev/image/upload/v1618938139/shopit/avatars/3268560e74a0f0f8f6070c3651d9342d_cefhnu.jpg",
    },
  });

  res.status(201).json({
    success: true,
    user,
  });
});
