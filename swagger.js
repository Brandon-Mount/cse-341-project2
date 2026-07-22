const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Game Library API",
    description: "CRUD API for games and game developers",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
