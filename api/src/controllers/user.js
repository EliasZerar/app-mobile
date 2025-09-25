const express = require("express");
const router = express.Router();

const UserObject = require("../models/user");

const SERVER_ERROR = "SERVER_ERROR";

router.get("/", async (req, res) => {
    try {
        const users = await UserObject.find();

        return res.status(200).send({ ok: true, users });
    } catch (error) {
        return res.status(500).send({ ok: false, code: SERVER_ERROR, error });
    }
});

module.exports = router;