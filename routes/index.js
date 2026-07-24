const router = require("express").Router();

router.get("/", (req, res) => {
  //#swagger.tags = ["Home"]

  res.status(200).json({
    message: "Welcome to the Game Library API",
    loggedIn: req.isAuthenticated(),
  });
});

router.use("/", require("./swagger"));
router.use("/auth", require("./auth"));
router.use("/games", require("./games"));
router.use("/developers", require("./developers"));

module.exports = router;
