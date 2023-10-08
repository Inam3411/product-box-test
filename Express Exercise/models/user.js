'use strict';
const { Model } = require('sequelize');
const crypto = require('crypto')
const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      
    }

    async createAndGetOTP() {
      const OTP = Math.floor(100000 + Math.random() * 900000).toString();
      this.otp = crypto.createHash("sha256").update(OTP).digest('hex');
      this.otp_expiration_date =  moment().add(5, 'minutes'); 
      
      return OTP;
    }
    
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    otp: DataTypes.STRING,
    otp_expiration_date: DataTypes.DATE,
    phone_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false, 
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
