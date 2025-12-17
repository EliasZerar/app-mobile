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
        let matchesData = req.body.matches || [req.body];

        const formattedMatches = matchesData.map(match => ({
            id: match.id,
            utcDate: new Date(
                match.utcDate.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:00Z")
            ),
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