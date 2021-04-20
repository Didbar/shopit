const User = require("../models/user");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");

//Register a user  => /api/v1/register
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

  sendToken(user, 200, res);
});

//Login User => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //checks if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }
  //Finding user in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  //Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password"), 401);
  }
  sendToken(user, 200, res);
});

//Forgot Password => /api/v1/password/Forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  //Get Reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({
    validateBeforeSave: false,
  });

  //Create Reset Password Url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

  try {
    await sendMail({
      email: user.email,
      subject: "Shopit password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password =>  /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  //set up new password
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//Logout user => /api/v1/logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});
