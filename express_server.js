const express = require('express');

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

const fs = require('fs');

const PORT = 8080;

// GET / renders the main battleship page and the users for the leaderboard
// from the leaderboard.json file
app.get('/', (req, res) => {
  fs.readFile('leaderboard.json', (err, data) => {
    if (err) {
      throw err;
    } else {
      const obj = JSON.parse(data);
      const userArr = Object.entries(obj);
      userArr.sort((a, b) => b[1] - a[1]);
      const templateVars = { userWins: userArr };
      res.render('index.ejs', templateVars);
    }
  });
});

// POST / adds the winner to the leaderboard and then redirects to GET /
app.post('/', (req, res) => {
  const { name } = req.body;
  fs.readFile('leaderboard.json', (errRead, data) => {
    if (errRead) {
      throw errRead;
    } else {
      const obj = JSON.parse(data);
      if (name in obj) {
        obj[name] += 1;
      } else {
        obj[name] = 1;
      }
      const json = JSON.stringify(obj);
      fs.writeFile('leaderboard.json', json, (errWrite) => {
        if (errWrite) {
          throw errWrite;
        }
        res.redirect('/');
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Battleship listening on port ${PORT}!`); // eslint-disable-line no-console
});
