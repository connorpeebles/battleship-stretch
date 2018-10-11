const express = require("express");
const app = express();

app.use(express.static("public"));

const PORT = 8080;

app.get("/", (req, res) => {
  res.sendFile("index.html", {root: __dirname});
});

app.listen(PORT, () => {
  console.log(`Battleship listening on port ${PORT}!`); // eslint-disable-line no-console
});