const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const movieRoute = require("./routes/movie");
const bodyParser = require("body-parser");
const portNum = process.env.PORT || 5000;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//Body parser
//app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

//config dotenv
dotenv.config();

mongoose.Promise = global.Promise;

// Connect Mongodb
mongoose
  .connect(process.env.DB_CONNECT, options)
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//Routes
app.use("/api/user", authRoute);
app.use("/api/movies", movieRoute);

//error handling middleware
app.use((err, req, res, next) => {
  res
    .status(404)
    .send({ error: err._message || "oops something went wrong!!!" });
});
// Starting server
app.listen(portNum, () => {
  console.log(`Server up and running at port ${portNum}`);
});
