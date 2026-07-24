require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const mongodb = require("./data/database.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Render uses a reverse proxy.
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Parse JSON request bodies.
app.use(express.json());

// CORS headers.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Login session.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    },
  }),
);

// Passport must come after express-session.
app.use(passport.initialize());
app.use(passport.session());

// Application routes.
app.use("/", require("./routes"));

// General application error handler.
app.use((error, req, res, next) => {
  console.error(error);

  return res.status(500).json({
    message: "An unexpected server error occurred.",
  });
});

// Connect to MongoDB before starting the server.
mongodb.initDb((error) => {
  if (error) {
    console.error("Database connection failed:", error);
  } else {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
});
