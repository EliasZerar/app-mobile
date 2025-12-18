const express = require("express");
const router = express.Router();
const passport = require("passport");

const UserObject = require("../models/user");

const SERVER_ERROR = "SERVER_ERROR";

router.get("/",
    passport.authenticate(["user"], { session: false, failWithError: true }),
    async (req, res) => {
        try {
            if (!req.user._id)
                return res.status(403).send({ ok: false, code: "FORBIDDEN" });
            const users = await UserObject.find().select('-password');
            return res.status(200).send({ ok: true, users });
        } catch (error) {
            return res.status(500).send({ ok: false, code: SERVER_ERROR, error });
        }
    }
);

router.get("/:id",
    passport.authenticate(["user"], { session: false, failWithError: true }),
    async (req, res) => {
        try {
            if (!req.user._id)
                return res.status(403).send({ ok: false, code: "FORBIDDEN" });
            const user = await UserObject.findById(req.params.id).select('-password');
            return res.status(200).send({ ok: true, user });
        } catch (error) {
            return res.status(500).send({ ok: false, code: SERVER_ERROR, error });
        }
    }
);

module.exports = router;