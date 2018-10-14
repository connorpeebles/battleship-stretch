"use strict";

// **DATA**

// array representing the user's ships
const userFleet = [
  {
    name: "carrier",
    numCoords: 5,
    coords: [],
    jq: $("<div>").attr("id", "carrier")
  },
  {
    name: "battleship",
    numCoords: 4,
    coords: [],
    jq:$("<div>").attr("id", "battleship")
  },
  {
    name: "cruiser",
    numCoords: 3,
    coords: [],
    jq: $("<div>").attr("id", "cruiser")
  },
  {
    name: "submarine",
    numCoords: 3,
    coords: [],
    jq: $("<div>").attr("id", "submarine")
  },
  {
    name: "destroyer",
    numCoords: 2,
    coords: [],
    jq: $("<div>").attr("id", "destroyer")
  }
];

// array represeting the computer's ships
const compFleet = [
  {
    name: "carrier",
    numCoords: 5,
    coords: []
  },
  {
    name: "battleship",
    numCoords: 4,
    coords: []
  },
  {
    name: "cruiser",
    numCoords: 3,
    coords: []
  },
  {
    name: "submarine",
    numCoords: 3,
    coords: []
  },
  {
    name: "destroyer",
    numCoords: 2,
    coords: []
  }
];

// object of arrays representing the coordinates on which the user's and computer's ships lay
const coords = {
  userCoords: [],
  compCoords: []
};

// arrays representing the coordinates of which the user and computer have thus far guessed
const userGuesses = [];
const compGuesses = [];

// array representing the coordinates of the current ship that the computer has started sinking
let compCurGuess = [];


// **GAME PLAY**

// remainingShips takes in an array of ships "fleet" and outputs a string displaying the names
// and sizes of the ships in fleet
function remainingShips(fleet) {
  let output = "";

  for (let ship of fleet) {
    let name = ship.name;
    let size = ship.numCoords;
    output = output + name + " (" + size + " squares), ";
  }

  return output.substring(0, output.length - 2);
}

// fillGrid takes in a jQuery element representing a "grid" and a string representing the class
// of coordinates "coordclass"(userCoord or compCoord) that will occupy the grid
function fillGrid(grid, coordClass) {

  let refCoord = $("<div>").addClass("refCoord");
  $(grid).append(refCoord);

  // appends the letter reference coordinates (A - J) to the top of "grid"
  for (let i = 1; i <= 10; i++) {

    refCoord = $("<div>").addClass("refCoord");
    $(refCoord).css({marginLeft: (60*i)+"px"});
    $(refCoord).text(String.fromCharCode(64 + i));
    $(grid).append(refCoord);
  }

  // appends the numeric reference coordinates (1 - 10) to the left of "grid"
  for (let i = 1; i <= 10; i++) {

    refCoord = $("<div>").addClass("refCoord");
    $(refCoord).css({marginTop: (60*i)+"px"});
    $(refCoord).text(i);
    $(grid).append(refCoord);

    // appends the coordinates of class "coordClass" to the main area of "grid"
    for (let j = 1; j <= 10; j++) {

      let coord = $("<div>").addClass(coordClass);
      $(coord).css({marginTop: (60*i)+"px", marginLeft: (60*j)+"px"});
      $(grid).append(coord);
    }
  }

}

// checkCoords takes in an array of coordinates "coordList" and an array of length four "shipPosition",
// where:
//   shipPosition[0] is a jQuery element representing a ship
//   shipPosition[1] is an integer representing the top of the ship, in pixels, relative to its grid
//   shipPosition[2] is an integer representing the left of the ship, in pixels, relative to its grid
//   shipPosition[3] is a boolean representing whether the ship is vertical (true) or horizontal (false)
// and returns false if the ship overlaps with another ship already placed on the grid by checking its
// coordinates against coordList, else places the ship and returns truthe gride
function checkCoords(shipPosition, coordList) {
  let ship = shipPosition[0];
  let top = shipPosition[1];
  let left = shipPosition[2];
  let vertical = shipPosition[3];

  let numCoords = ship.numCoords;
  let shipCoords = [];

  // checks each coordinate of the ship being placed to see if overlaps with another ship already
  // placed, and returns false if there is overlap
  while (numCoords > 0) {
    let coord = `${left},${top}`;

    if (coords[coordList].includes(coord)) {
      return false;
    } else {
      shipCoords.push(coord);

      if (vertical) {
        top++;
      } else {
        left++;
      }

      numCoords--;
    }
  }

  // sets the coordinates of the ship if there is no overlap and returns true
  ship.coords = shipCoords;
  coords[coordList] = coords[coordList].concat(shipCoords);
  return true;
}

// placeUserShips takes in an array of ships "fleet" and a jQuery element "grid" representing the
// grid on which the ships in "fleet" will be appended to
function placeUserShips(fleet, grid) {

  // when all the ships have been placed, start the game
  if (fleet.length === 0) {
    userTurn();
    return;
  }

  let ship = fleet[0].jq;
  let shipName = fleet[0].name;
  let numTiles = fleet[0].numCoords;

  $("#instructionBox").text("Use your mouse to drag and place your \"" + shipName + "\" ship. Double-click the ship with your mouse to switch the ship's orientation. Press Enter to confirm the ship's location.");

  $(grid).append(ship);

  let vertical = false;

  // makes ship draggable
  $(ship).draggable({opacity: 0.6, grid: [60,60], containment: grid});

  // ship changes orientation (horizontal vs vertical) when user double-clicks it
  $(ship).dblclick(function() {
    let Top = parseInt($(ship).css("top"));
    let Left = parseInt($(ship).css("left"));
    let tempH = parseInt($(ship).css("height"));
    let tempW = parseInt($(ship).css("width"));

    // ensures the ship remains within the constraints of the grid when the user double-clicks
    if (Top + tempW > 655) {
      Top = 660 - (60 * numTiles);
    }
    if (Left + tempH > 655) {
      Left = 660 - (60 * numTiles);
    }

    vertical = !vertical;
    $(ship).css({height: tempW, width: tempH, top: Top, left: Left});
  });

  // ship's position is finalized when the user presses enter
  $(document).keypress(function(e) {

    if (e.which === 13) {
      let Top = Math.round(parseInt($(ship).css("top")) / 60);
      let Left = Math.round(parseInt($(ship).css("left")) / 60);
      let shipPosition = [fleet[0], Top, Left, vertical];

      // ensures user doesn't place ship in the reference coordinate squares or on top of each
      // other, then recursively calls placeUserShips to place the next ship in the fleet
      if (Top === 0 || Left === 0) {
        $("#instructionBox").text("Please place your ship in the water (blue squares)!");
      } else if (!checkCoords(shipPosition, "userCoords")) {
        $("#instructionBox").text("Please don't place your ships on top of each other!");
      } else {
        $("#"+shipName).off();
        placeUserShips(fleet.slice(1), grid);
      }
    }
  });
}

// placeCompShips takes in an array of ships "fleet" and randomly places them upon its grid
function placeCompShips(fleet) {

  // when all the ships have been placed, stop
  if (fleet.length === 0) {
    return;
  }

  let numTiles = fleet[0].numCoords;

  // randomly determines whether the current ship being placed will be vertical or horizontal and
  // its coordinates
  let vertical = Math.floor(Math.random() * 2);
  let top;
  let left;

  if (vertical) {
    top = Math.ceil(Math.random() * (11 - numTiles));
    left = Math.ceil(Math.random() * 10);
  } else {
    top =  Math.ceil(Math.random() * 10);
    left = Math.ceil(Math.random() * (11 - numTiles));
  }

  let shipPosition = [fleet[0], top, left, vertical];

  // ensures the computer doesn't place ships on top of each other, then recursively calls
  // placeCompShips to place the next ship in the fleet
  if (!checkCoords(shipPosition, "compCoords")) {
    placeCompShips(fleet);
  } else {
    placeCompShips(fleet.slice(1));
  }
}

// checkUserHit takes in an array of ships "fleet" and an array of length two "coordArr", where:
//   coordArr[0] is an integer representing the x-coordinate of the user's guess
//   coordArr[1] is an integer representing the y-coordinate of the user's guess
// and returns true if the user guesses a coordinate in fleet (hit), else false (miss)
function checkUserHit(coordArr, fleet) {
  let x = coordArr[0];
  let y = coordArr[1];
  let coord = `${x},${y}`;

  let letter = String.fromCharCode(64 + x);

  // checks the coordinate against each ship in fleet
  for (let ship of fleet) {
    let index = ship.coords.indexOf(coord);

    // if the coordinate is in the ships in fleet, return true (hit)
    if (index > -1) {
      ship.coords.splice(index, 1);

      // if the coordinate is the final coordinate in ship, remove the ship from fleet (ship is sunk)
      if (ship.coords.length === 0) {
        let shipName = ship.name;
        index = fleet.indexOf(ship);
        fleet.splice(index,1);
        $("#instructionBox").text(`${letter}${y}: Hit! You sunk your opponent's ${shipName}!`);
        let compShips = remainingShips(compFleet);
        $("#shipsComp").text("Ships remaining: " + compShips);
      } else {
        $("#instructionBox").text(`${letter}${y}: Hit!`);
      }

      return true;
    }
  }

  // if the coordinate is not in the ships in fleet, return false (miss)
  $("#instructionBox").text(`${letter}${y}: Miss!`);
  return false;
}

// userTurn is the main functioncall for when it is the user's turn to guess
function userTurn() {

  // end game if all of user's ships have been sunk (user loses)
  if (userFleet.length === 0) {
    $("#instructionBox").text("Oh no! You lost! :(");
    return;
  }

  $("#instructionBox").text("Your turn! Click any blue square on your opponent's grid to fire!");

  // user guesses a coordinate by clicking it
  $(".compCoord").click(function() {
    let y = Math.round(parseInt($(this).css("marginTop")) / 60);
    let x = Math.round(parseInt($(this).css("marginLeft")) / 60);
    let coord = `${x},${y}`;

    // ensures user doesn't click a square they have already guessed
    if (userGuesses.includes(coord)) {
      $("#instructionBox").text("You've already fired here! Click any blue square on your opponent's grid.");

    // if user guesses a coordinate of the computer's fleet (hit), display the coordinate as hit
    // and call compTurn
    } else if (checkUserHit([x, y], compFleet)) {
      $(".compCoord").off();
      $(this).css({background: "#FF0000"});
      userGuesses.push(coord);

      // if the user guesses the final coordinate of the computer's fleet, display a winning
      // message and allow the user to enter their name for the leaderboard
      if (compFleet.length === 0) {
        $("#instructionBox").text("Congratulations! You win! :)");
        $("#newGame").css({visibility: "hidden"});
        $("#enterName").css({visibility: "visible"});
        return;
      }

      compTurn();
      return;

    // if user misses, display the coordinate as missed and call compTurn
    } else {
      $(".compCoord").off();
      $(this).css({background: "#FFFFFF"});
      userGuesses.push(coord);
      compTurn();
      return;
    }
  });
}

// checkCompHit takes in an array of ships "fleet" and an array of length two "coordArr", where:
//   coordArr[0] is an integer representing the x-coordinate of the computer's guess
//   coordArr[1] is an integer representing the y-coordinate of the computer's guess
// and returns true if the computer guesses a coordinate in fleet (hit), else false (miss)
function checkCompHit(coordArr, fleet) {
  let x = coordArr[0];
  let y = coordArr[1];
  let coord = `${x},${y}`;

  let letter = String.fromCharCode(64 + x);

  // checks the coordinate against each ship in fleet
  for (let ship of fleet) {
    let index = ship.coords.indexOf(coord);

    // if the coordinate is in the ships in fleet, return true (hit) and add the guess to compCurGuess array
    if (index > -1) {
      ship.coords.splice(index, 1);

      // if the coordinate is the final coordinate in ship, remove the ship from fleet (ship is sunk)
      // and empty compCurGuess array
      if (ship.coords.length === 0) {
        let shipName = ship.name;
        index = fleet.indexOf(ship);
        fleet.splice(index,1);
        compCurGuess = [];
        $("#instructionBox").text(`${letter}${y}: Hit! Your opponent sunk your ${shipName}!`);
        let userShips = remainingShips(userFleet);
        $("#shipsUser").text("Ships remaining: " + userShips);
      } else {
        compCurGuess.push(coord);
        $("#instructionBox").text(`Your opponent fired. ${letter}${y}: Hit!`);
      }

      return true;
    }
  }

  // if the coordinate is not in the ships in fleet, return false (miss)
  $("#instructionBox").text(`Your opponent fired. ${letter}${y}: Miss!`);
  return false;
}

// compGuess strategically guesses a coordinate on the user's grid
function compGuess() {
  let x;
  let y;
  let coord;

  // if the computer currently has one hit for a specific ship, it's next guess will be one coordinate
  // below, above, to the left, or to the right of said coordinate
  if (compCurGuess.length === 1) {
    let curCoords = compCurGuess[0].split(",");
    let curX = Number(curCoords[0]);
    let curY = Number(curCoords[1]);
    let rand = Math.floor(Math.random() * 2);

    if (rand === 0) {
      x = curX;
      y = curY + 1;
      coord = `${x},${y}`;

      if (y > 10 || compGuesses.includes(coord)) {
        y = curY - 1;
        coord = `${x},${y}`;
      }

    } else {
      x = curX + 1;
      y = curY;
      coord = `${x},${y}`;

      if (x > 10 || compGuesses.includes(coord)) {
        x = curX - 1;
        coord = `${x},${y}`;
      }
    }

  // if the computer currently has more than one hit for a specific ship, it's next guess will be
  // in the same direction that its guesses indicates (vertical or horizontal)
  } else if (compCurGuess.length > 1) {
    let curCoords = compCurGuess[0].split(",");
    let curX = Number(curCoords[0]);
    let curY = Number(curCoords[1]);
    let curCoords2 = compCurGuess[compCurGuess.length - 1].split(",");
    let curX2 = Number(curCoords2[0]);
    let curY2 = Number(curCoords2[1]);

    // if the x-coordinates of the two guesses in compCurGuess are the same, the computer's next
    // guess will have the same x-coordinate, and have a y-coordinate of one greater than the
    // current maximum y-coordinate in compCurGuesses
    if (curX === curX2) {
      x = curX;
      let maxY = Math.max(curY, curY2);
      let minY = Math.min(curY, curY2);
      y = maxY + 1;
      coord = `${x},${y}`;

      // if that y-coordinate is greater than 10 or the computer has already guessed that set of
      // coordinates, then the computer updates its guess to have the same x-coordinate, and have a
      // y-coordinate of one less than the current minimum y-coordinate in compCurGuesses
      if (y > 10 || compGuesses.includes(coord)) {
        y = minY - 1;
        coord = `${x},${y}`;

        // if that y-coordinate is less than 1 or the computer has already guessed that set of
        // coordinates, then the computer forgets about the current ship it is trying to sink and
        // returns to randomly guessing coordinates
        if (y < 1 || compGuesses.includes(coord)) {
          compCurGuess = [];
          compGuess();
          return;
        }
      }

    // if the y-coordinates of the two guesses in compCurGuess are the same, the computer's next
    // guess will have the same y-coordinate, and have an x-coordinate of one greater than the
    // current maximum x-coordinate in compCurGuesses
    } else {
      y = curY;
      let maxX = Math.max(curX, curX2);
      let minX = Math.min(curX, curX2);
      x = maxX + 1;
      coord = `${x},${y}`;

      // if that x-coordinate is greater than 10 or the computer has already guessed that set of
      // coordinates, then the computer updates its guess to have the same y-coordinate, and have an
      // x-coordinate of one less than the current minimum x-coordinate in compCurGuesses
      if (x > 10 || compGuesses.includes(coord)) {
        x = minX - 1;
        coord = `${x},${y}`;

        // if that x-coordinate is less than 1 or the computer has already guessed that set of
        // coordinates, then the computer forgets about the current ship it is trying to sink and
        // returns to randomly guessing coordinates
        if (x < 1 || compGuesses.includes(coord)) {
          compCurGuess = [];
          compGuess();
          return;
        }
      }
    }

  // if the computer has no current hits, it will guess a set of coordinates randomly
  } else {
    x =  Math.ceil(Math.random() * 10);
    y =  Math.ceil(Math.random() * 10);
    coord = `${x},${y}`;
  }

  // if the computer guesses a set of coordinates it has already guessed or an impossible guess,
  // it guesses again
  if (compGuesses.includes(coord) || x < 1 || x > 10 || y < 1 || y > 10) {
    compGuess();

  // if the computer's guess is valid, the guess is displayed on the user's grid
  } else {
    // checks whether the guess was a hit (true) or a miss (false)
    let hit = checkCompHit([x, y], userFleet);
    compGuesses.push(coord);

    let guess = $("<div>").addClass("compGuess");
    $(guess).css({marginLeft: (60*x)+"px", marginTop: (60*y)+"px"});
    $(guess).text("x");

    if (hit) {
      $(guess).css({color: "#FF0000"});
    }

    $("#userGrid").append(guess);
  }
}

// compTurn is the main functioncall for when it is the computer's turn to guess
function compTurn() {

  // function calls are delayed to simulate thinking and also allow time to display messages
  setTimeout(compGuess, 2000);
  setTimeout(userTurn, 4500);
}

// playBattleShip is the main functioncall to start the game
function playBattleship() {

  let userGrid = $("#userGrid")[0];
  let compGrid = $("#compGrid")[0];

  let userShips = remainingShips(userFleet);
  $("#shipsUser").text("Ships remaining: " + userShips);

  let compShips = remainingShips(compFleet);
  $("#shipsComp").text("Ships remaining: " + compShips);

  fillGrid(userGrid, "userCoord");
  fillGrid(compGrid, "compCoord");

  placeUserShips(userFleet, userGrid);
  placeCompShips(compFleet);
}