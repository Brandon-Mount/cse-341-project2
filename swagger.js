require("dotenv").config();

const swaggerAutogen = require("swagger-autogen")();

const isProduction = Boolean(process.env.API_HOST);

const doc = {
  info: {
    title: "Game Library API",
    description: "CRUD API for games and game developers",
  },

  host: process.env.API_HOST || "localhost:3000",

  schemes: isProduction ? ["https"] : ["http"],
};

const outputFile = "./swagger-output.json";

const endpointsFiles = [
  "./routes/index.js",
  "./routes/games.js",
  "./routes/developers.js",
];

swaggerAutogen(outputFile, endpointsFiles, doc);
