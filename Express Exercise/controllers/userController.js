const {User}  = require('../models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync')
const crypto = require('crypto')
const moment = require('moment')


const createUser = catchAsync(async (req, res, next) => {

    const {name, phone_number} = req.body
    const user = await User.create({name, phone_number});
    return res.status(201).json({
      message: "User created successfully",
      data: user
    });
});

const generateOTP = catchAsync(async (req, res, next) => {
    const { phone_number } = req.body;
    
    const user = await User.findOne({ where: { phone_number } });
    if (!user) {
      return next(new AppError("User not found", 404))
    }

    const OTP = await user.createAndGetOTP();
    console.log("OTP: ", OTP)   //We can then send it through phone number

    await user.save();

    return res.status(200).json({ user_id: user.id });
});

const verifyOTP = catchAsync(async (req, res, next) => {
    const { user_id } = req.params;
    let { otp } = req.query;

    const user = await User.findByPk(user_id);

    if (!user) {
      return next(new AppError("User not found", 404))
    }

    const currentDateTime = moment();
    const isExpired = currentDateTime.isAfter(user.otp_expiration_date);

    if (isExpired) {
      return next(new AppError("OTP is Expired", 400))
    }

    otp = crypto.createHash("sha256").update(otp).digest('hex');
    if (user.otp !== otp) {
      return next(new AppError("Incorrect OTP", 400))
    }

    user.otp=null
    user.otp_expiration_date=null

    await user.save();

    return res.status(200).json({
      message:'User OTP verified successfully',
      data:user
    });
});

module.exports = {
  createUser,
  generateOTP,
  verifyOTP,
};
