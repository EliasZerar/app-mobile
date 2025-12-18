const express = require("express");
const router = express.Router();

const UserObject = require("../models/user");

const SERVER_ERROR = "SERVER_ERROR";

router.get("/", async (req, res) => {
    try {
        const users = await UserObject.find().select('-password');

        return res.status(200).send({ ok: true, users });
    } catch (error) {
        return res.status(500).send({ ok: false, code: SERVER_ERROR, error });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const user = await UserObject.findById(req.params.id).select('-password');
        return res.status(200).send({ ok: true, user });
    } catch (error) {
        return res.status(500).send({ ok: false, code: SERVER_ERROR, error });
    }
});

module.exports = router;