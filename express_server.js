const express = require("express");
const app = express();

app.use(express.static("public"));
app.set("vie engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const fs = require("fs");

const PORT = 8080;

app.get("/", (req, res) => {
  fs.readFile("leaderboard.json", function(err, data) {
    if (err) {
      throw err;
    } else {
      const obj = JSON.parse(data);
      const userArr = [];
      for (let user in obj) {
        userArr.push([user, obj[user]]);
      }
      userArr.sort(function(a, b) {
        return b[1] - a[1];
      });
      let templateVars = {userWins: userArr};
      res.render("index.ejs", templateVars);
    }
  });
});

app.post("/", (req, res) => {
  let name = req.body.name;
  fs.readFile("leaderboard.json", function(err, data) {
    if (err) {
      throw err;
    } else {
      const obj = JSON.parse(data);
      if (name in obj) {
        obj[name]++;
      } else {
        obj[name] = 1;
      }
      let json = JSON.stringify(obj);
      fs.writeFile("leaderboard.json", json, function(err) {
        if (err) {
          throw err;
        }
        res.redirect("/");
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Battleship listening on port ${PORT}!`); // eslint-disable-line no-console
});