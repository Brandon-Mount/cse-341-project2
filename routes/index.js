const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).send("Game Library API");
});

router.use("/", require("./swagger.js"));
router.use("/games", require("./games.js"));
router.use("/developers", require("./developers.js"));

module.exports = router;
