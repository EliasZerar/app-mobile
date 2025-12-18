const express = require("express");
const router = express.Router();
const passport = require("passport");

const MatchObject = require("../models/match");

const SERVER_ERROR = "SERVER_ERROR";

router.get("/",
    passport.authenticate(["user"], { session: false, failWithError: true }),
    async (req, res) => {
        try {
            if (!req.user._id)
                return res.status(403).send({ ok: false, code: "FORBIDDEN" });
            const matches = await MatchObject.find();

            return res.status(200).send({ ok: true, matches });
        } catch (error) {
            return res.status(500).send({ ok: false, code: "SERVER_ERROR", error });
        }
    });


router.post("/",
    passport.authenticate(["user"], { session: false, failWithError: true }),
    async (req, res) => {
        try {
            if (!req.user._id)
                return res.status(403).send({ ok: false, code: "FORBIDDEN" });
            let matchesData = req.body.matches;

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