const mongoose = require("mongoose");
const MODELNAME = "match";

const TeamSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    crest: { type: String, required: true },
    tla: { type: String, required: true },
});

const CompetitionSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    emblem: { type: String, required: true },
});

const MatchSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    utcDate: { type: Date, required: true },
    homeTeam: { type: TeamSchema, required: true },
    awayTeam: { type: TeamSchema, required: true },
    competition: { type: CompetitionSchema, required: true },
    createdAt: { type: Date, default: Date.now }
});

const OBJ = mongoose.model(MODELNAME, MatchSchema);
module.exports = OBJ;
