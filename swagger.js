require("dotenv").config();

const swaggerAutogen = require("swagger-autogen")({
  openapi: "3.0.0",
});

const apiHost = process.env.API_HOST || "localhost:3000";

const apiProtocol = apiHost.includes("onrender.com") ? "https" : "http";

const doc = {
  info: {
    title: "Game Library API",
    description:
      "CRUD API for games and game developers with GitHub OAuth authentication.",
    version: "1.0.0",
  },

  servers: [
    {
      url: `${apiProtocol}://${apiHost}`,
      description: apiHost.includes("onrender.com")
        ? "Render production server"
        : "Local development server",
    },
  ],

  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "connect.sid",
        description:
          "Login through /auth/github to create an authenticated session.",
      },
    },
  },

  tags: [
    {
      name: "Games",
      description: "Game collection routes",
    },
    {
      name: "Developers",
      description: "Developer collection routes",
    },
    {
      name: "Authentication",
      description: "GitHub OAuth login and logout routes",
    },
  ],
};

const outputFile = "./swagger-output.json";

const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
