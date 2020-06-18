const mongoose = require("mongoose");
const User = require("./User");
const { number } = require("@hapi/joi");

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Movie name is required."],
  },
  summary: {
    type: String,
    required: [true, "Movie summary is required"],
  },
  ratedBy: {
    type: [],
    required: false,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userRating: {
    type: mongoose.Schema.Types.Decimal128,
    required: false,
  },
  avgRating: {
    type: mongoose.Schema.Types.Decimal128,
    required: false,
    default: 0,
  },
});

module.exports = mongoose.model("Movie", movieSchema);
