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
        const newMatch = await MatchObject.create({
            id: req.body.id,
            utcDate: new Date(
                req.body.utcDate.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:00Z")
            ),
            homeTeam: req.body.homeTeam,
            awayTeam: req.body.awayTeam,
            competition: req.body.competition
        });

        return res.status(201).send({ ok: true, newMatch });
    } catch (error) {
        return res.status(500).send({ ok: false, code: SERVER_ERROR, error });
    }
})


module.exports = router;