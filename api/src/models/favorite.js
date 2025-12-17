const mongoose = require("mongoose");

const MODELNAME = "favorite";

const Schema = new mongoose.Schema({
    matchId: { type: String, required: true },
    userId: { type: String, required: true },
});

Schema.index({ matchId: 1, userId: 1 }, { unique: true });
const OBJ = mongoose.model(MODELNAME, Schema);

module.exports = OBJ;
