const mongodb = require("../data/database.js");
const { ObjectId } = require("mongodb");

const validateDeveloper = (developer) => {
  if (
    !developer.name ||
    !developer.country ||
    developer.foundedYear === undefined ||
    !developer.website
  ) {
    return false;
  }

  if (
    typeof developer.name !== "string" ||
    typeof developer.country !== "string" ||
    typeof developer.foundedYear !== "number" ||
    typeof developer.website !== "string"
  ) {
    return false;
  }

  return true;
};

const getAll = async (req, res) => {
  try {
    const developers = await mongodb
      .getDatabase()
      .collection("developers")
      .find()
      .toArray();

    res.status(200).json(developers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve developers.",
      error: error.message,
    });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid developer ID.",
      });
    }

    const developer = await mongodb
      .getDatabase()
      .collection("developers")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!developer) {
      return res.status(404).json({
        message: "Developer not found.",
      });
    }

    res.status(200).json(developer);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve the developer.",
      error: error.message,
    });
  }
};

const createDeveloper = async (req, res) => {
  try {
    const developer = {
      name: req.body.name,
      country: req.body.country,
      foundedYear: req.body.foundedYear,
      website: req.body.website,
    };

    if (!validateDeveloper(developer)) {
      return res.status(400).json({
        message:
          "All developer fields are required and must use the correct types.",
      });
    }

    const response = await mongodb
      .getDatabase()
      .collection("developers")
      .insertOne(developer);

    res.status(201).json({
      message: "Developer created successfully.",
      id: response.insertedId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create the developer.",
      error: error.message,
    });
  }
};

const updateDeveloper = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid developer ID.",
      });
    }

    const developer = {
      name: req.body.name,
      country: req.body.country,
      foundedYear: req.body.foundedYear,
      website: req.body.website,
    };

    if (!validateDeveloper(developer)) {
      return res.status(400).json({
        message:
          "All developer fields are required and must use the correct types.",
      });
    }

    const response = await mongodb
      .getDatabase()
      .collection("developers")
      .replaceOne({ _id: new ObjectId(req.params.id) }, developer);

    if (response.matchedCount === 0) {
      return res.status(404).json({
        message: "Developer not found.",
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: "Failed to update the developer.",
      error: error.message,
    });
  }
};

const deleteDeveloper = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid developer ID.",
      });
    }

    const response = await mongodb
      .getDatabase()
      .collection("developers")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (response.deletedCount === 0) {
      return res.status(404).json({
        message: "Developer not found.",
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete the developer.",
      error: error.message,
    });
  }
};

module.exports = {
  getAll,
  getSingle,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
};
