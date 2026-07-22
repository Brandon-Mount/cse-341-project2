const mongodb = require("../data/database.js");
const { ObjectId } = require("mongodb");

const validateGame = (game) => {
  if (
    !game.title ||
    !game.genre ||
    !game.platform ||
    game.releaseYear === undefined ||
    !game.developer ||
    game.rating === undefined ||
    game.multiplayer === undefined
  ) {
    return false;
  }

  if (
    typeof game.title !== "string" ||
    typeof game.genre !== "string" ||
    typeof game.platform !== "string" ||
    typeof game.releaseYear !== "number" ||
    typeof game.developer !== "string" ||
    typeof game.rating !== "number" ||
    typeof game.multiplayer !== "boolean"
  ) {
    return false;
  }

  return true;
};

const getAll = async (req, res) => {
  try {
    const games = await mongodb
      .getDatabase()
      .collection("games")
      .find()
      .toArray();

    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve games.",
      error: error.message,
    });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid game ID.",
      });
    }

    const game = await mongodb
      .getDatabase()
      .collection("games")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!game) {
      return res.status(404).json({
        message: "Game not found.",
      });
    }

    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve the game.",
      error: error.message,
    });
  }
};

const createGame = async (req, res) => {
  try {
    const game = {
      title: req.body.title,
      genre: req.body.genre,
      platform: req.body.platform,
      releaseYear: req.body.releaseYear,
      developer: req.body.developer,
      rating: req.body.rating,
      multiplayer: req.body.multiplayer,
    };

    if (!validateGame(game)) {
      return res.status(400).json({
        message: "All game fields are required and must use the correct types.",
      });
    }

    const response = await mongodb
      .getDatabase()
      .collection("games")
      .insertOne(game);

    res.status(201).json({
      message: "Game created successfully.",
      id: response.insertedId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create the game.",
      error: error.message,
    });
  }
};

const updateGame = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid game ID.",
      });
    }

    const game = {
      title: req.body.title,
      genre: req.body.genre,
      platform: req.body.platform,
      releaseYear: req.body.releaseYear,
      developer: req.body.developer,
      rating: req.body.rating,
      multiplayer: req.body.multiplayer,
    };

    if (!validateGame(game)) {
      return res.status(400).json({
        message: "All game fields are required and must use the correct types.",
      });
    }

    const response = await mongodb
      .getDatabase()
      .collection("games")
      .replaceOne({ _id: new ObjectId(req.params.id) }, game);

    if (response.matchedCount === 0) {
      return res.status(404).json({
        message: "Game not found.",
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: "Failed to update the game.",
      error: error.message,
    });
  }
};

const deleteGame = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid game ID.",
      });
    }

    const response = await mongodb
      .getDatabase()
      .collection("games")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (response.deletedCount === 0) {
      return res.status(404).json({
        message: "Game not found.",
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete the game.",
      error: error.message,
    });
  }
};

module.exports = {
  getAll,
  getSingle,
  createGame,
  updateGame,
  deleteGame,
};
