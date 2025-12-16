require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

require("./src/services/mongo");

app.use(morgan("tiny"));
app.use(cors({ credentials: true, origin: "*" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/user", require("./src/controllers/user"));

app.use("/match", require("./src/controllers/match"));

app.use("/auth", require("./src/controllers/auth"));

app.use("/favorite", require("./src/controllers/favorite"));

app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`);
});