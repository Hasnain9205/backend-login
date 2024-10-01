const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const addRoutes = require("./routes/addRoutes");
const port = process.env.PORT || 5000;
require("dotenv").config();
require("./DB-Connection/DB-connect");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/product", addRoutes);

app.get("/", (req, res) => {
  console.log(req.body);
  res.send("Data received");
});

app.listen(port, () => {
  console.log(`Server started ${process.env.PORT}`);
});
