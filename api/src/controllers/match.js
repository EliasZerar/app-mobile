const express = require("express");
const router = express.Router();

const MatchObject = require("../models/match");

const SERVER_ERROR = "SERVER_ERROR";

router.get("/", async (req, res) => {
    try {
        const matches = await MatchObject.find();

        return res.status(200).send({ ok: true, matches });
    } catch (error) {
        return res.status(500).send({ ok: false, code: "SERVER_ERROR", error });
    }
});


router.post("/", async (req, res) => {
    try {
        let matchesData = req.body.matches;

        const formattedMatches = matchesData.map(match => ({
            id: match.id,
            utcDate: new Date(match.utcDate),
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            competition: match.competition,
        }));

        const newMatches = await MatchObject.insertMany(formattedMatches);

        return res.status(201).send({ ok: true, count: newMatches.length, newMatches });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ ok: false, code: SERVER_ERROR, error });
    }
});


module.exports = router;