const express = require("express");
const router = express.Router();
const passport = require("passport");
const FavoriteObject = require("../models/favorite");

const SERVER_ERROR = "SERVER_ERROR";

const test = async () => {
    const favorites = await FavoriteObject.find({userId: "694161816b074610e45c6def"});
    console.log("Favorite found", favorites);
}

test()
router.get("/",
    passport.authenticate(["user"], {
        session: false,
        failWithError: true,
    }),
    async (req, res) => {
    try {
        if(!req.user._id)
            return res.status(403).send({ ok: false, code: "FORBIDDEN" });
        const favorites = await FavoriteObject.find({userId: req.user._id});
        console.log("Favorite found", favorites);
        return res.status(200).send({ ok: true, favorites });
    } catch (error) {
        return res.status(500).send({ ok: false, code: "SERVER_ERROR", error });
    }
});


router.post("/",
    passport.authenticate(["user"], { session: false, failWithError: true }),
    async (req, res) => {
        try {
            const newFavorite = await FavoriteObject.create({
                matchId: req.body.matchId,
                userId: req.user._id
            });

            return res.status(201).send({ ok: true, newFavorite });
        } catch (error) {
            return res.status(500).send({ ok: false, code: SERVER_ERROR, error });
        }
    })

router.delete("/:matchId",
    passport.authenticate(["user"], { session: false, failWithError: true }),
    async (req, res) => {
        try {
            const userId = req.user._id;
            const matchId = req.params.matchId;

            const deletedFavorite = await FavoriteObject.findOneAndDelete({
                userId: userId,
                matchId: matchId
            });

            if (!deletedFavorite) {
                return res.status(404).send({ ok: false, code: "NOT_FOUND", error: "Favori non trouvé" });
            }

            return res.status(200).send({ ok: true, message: "Favori supprimé" });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ ok: false, code: "SERVER_ERROR", error });
        }
    });

module.exports = router;
