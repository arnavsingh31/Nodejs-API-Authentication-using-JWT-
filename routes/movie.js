const router = require("express").Router();
const verify = require("./verifytoken");
const Movie = require("../models/Movie");
const User = require("../models/User");

router.post("/", verify, async (req, res) => {
  const movie = await Movie.findOne({ name: req.body.name });
  if (movie) {
    return res
      .status(400)
      .json({ err_msg: "Movie already exists in the database." });
  }

  const newMovie = new Movie({
    name: req.body.name,
    summary: req.body.summary,
    authorId: req.user._id,
  });

  try {
    newMovie.save();
    res.json({ movie_id: newMovie._id, Success: "Movie added to DB" });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/rate", verify, async (req, res) => {
  const movie = await Movie.findById({ _id: req.body.id });
  // check whether the movie exists or not
  if (!movie) {
    return res.status(400).json({ message: "Movie does not exist" });
  }
  //check whether the user is the author of the posted movie
  if (movie.authorId == req.user._id) {
    return res.status(403).json({
      message: "You cannot rate your own posted movie.",
    });
  }

  // check whether the movie is rated by someone or not
  if (movie.ratedBy.length == 0) {
    movie.userRating = req.body.userRating;
    let ratedObj = {
      userId: req.user._id,
      rating: movie.userRating,
    };
    movie.avgRating = movie.userRating;
    movie.ratedBy.push(ratedObj);
    movie.save();
    return res.status(200).json({ message: "Your rating has been recorded" });
  }

  let isAlreadyRated = false;
  let arr_len = movie.ratedBy.length;
  let i;
  for (i = 0; i < arr_len; i++) {
    if (movie.ratedBy[i].userId == req.user._id) {
      isAlreadyRated = true;
    }
  }
  //check if the user has already rated this movie
  if (isAlreadyRated) {
    return res.status(200).json({
      message:
        "You have already rated this movie before. Try rating another movie.",
    });
  }

  // update the fields of a movie
  movie.userRating = req.body.userRating;
  let ratedObj = {
    userId: req.user._id,
    rating: movie.userRating,
  };
  movie.ratedBy.push(ratedObj);
  movie
    .save()
    .then(async () => {
      let avg_rating = 0;
      let movie = await Movie.findById({ _id: req.body.id });
      let arr_len = movie.ratedBy.length;

      for (i = 0; i < arr_len; i++) {
        avg_rating += parseFloat(movie.ratedBy[i].rating);
      }
      avg_rating = avg_rating / arr_len;

      movie.avgRating = avg_rating;
      movie.save();
      return res
        .status(200)
        .json({ message: "Your rating has been recorded!" });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
