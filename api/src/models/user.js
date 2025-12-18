const mongoose = require("mongoose");

const MODELNAME = "user";

const Schema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    resetPasswordOtp: { type: String },
    resetPasswordExpires: { type: Date },
});

const OBJ = mongoose.model(MODELNAME, Schema);

module.exports = OBJ;