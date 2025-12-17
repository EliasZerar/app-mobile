const express = require("express");
const router = express.Router();

const FavoriteObject = require("../models/favorite");

const SERVER_ERROR = "SERVER_ERROR";

router.get("/", async (req, res) => {
    try {
        const favorites = await FavoriteObject.find();

        return res.status(200).send({ ok: true, favorites });
    } catch (error) {
        return res.status(500).send({ ok: false, code: "SERVER_ERROR", error });
    }
});


router.post("/", async (req, res) => {
    try {
        const newFavorite = await FavoriteObject.create({
            matchId: req.body.matchId,
            userId: req.body.userId
        });

        return res.status(201).send({ ok: true, newFavorite });
    } catch (error) {
        return res.status(500).send({ ok: false, code: SERVER_ERROR, error });
    }
})

module.exports = router;
