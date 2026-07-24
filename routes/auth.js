const router = require("express").Router();
const passport = require("passport");

// Login with GitHub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

// GitHub callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/failure",
  }),
  (req, res) => {
    res.redirect("/auth/success");
  },
);

// Successful login
router.get("/success", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: "You are not logged in.",
    });
  }

  res.status(200).json({
    message: "Login successful.",
    user: req.user,
  });
});

// Failed login
router.get("/failure", (req, res) => {
  res.status(401).json({
    message: "GitHub login failed.",
  });
});

// Check login status
router.get("/status", (req, res) => {
  res.status(200).json({
    authenticated: req.isAuthenticated(),
    user: req.user || null,
  });
});

// Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({
        message: "Logout successful.",
      });
    });
  });
});

module.exports = router;
