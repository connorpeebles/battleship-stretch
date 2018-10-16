# Battleship Stretch Project

Battleship is a simple, single-page application game modelled after the classic nautical board game, in which the user battles against an AI.

## Final Product

#### Screenshot of placing ships during the set-up phase
![set-up](https://github.com/connorpeebles/battleship-stretch/blob/master/public/images/battleship_setup.png)

#### Screenshot of the gameplay
![game-play](https://github.com/connorpeebles/battleship-stretch/blob/master/public/images/battleship_gameplay.png)

## Features

- Place your ships on your grid by dragging them with your mouse; double-click the ship to swap its orientation, and confirm its position by pressing Enter.
- Take turns guessing the location of your opponent's ships.
  - On your turn, guess a coordinate on your oppoonent's grid by clicking it; it will turn red to indicate a 'hit' or white to indicate a 'miss'.
  - On your opponent's turn, the AI will randomly guess a coordinate on your grid; once it gets a 'hit', it will strategically continue to try to sink that specific ship.
- An instruction log at the bottom of the screen directs the user of what to do, and indicates every move which is made by either player.
- A list of ships remaining unsunk is displayed for each player under their gameboard.
- When the user beats their opponent, they can submit their name, and their total number of games won is displayed on the leaderboard to the right of the gameboards.
- A user can start a new game at any time by clicking the "New Game" button.

## Dependencies

- body-parser: ^1.18.3
- ejs: ^2.6.1
- express: ^4.16.4

#### Development Dependencies

- eslint: ^5.7.0
- eslint-config-airbnb-base: ^13.1.0
- eslint-plugin-import: ^2.14.0

## Getting Started

1. Fork this repository, then clone your fork of this repository.
2. Install dependencies using the `npm install` command.
3. Start the web server using the `npm start` command. The app will be served at <http://localhost:8080/>.
4. Go to <http://localhost:8080/> in your browser.