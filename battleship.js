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

const coords = {
  userCoords: [],
  compCoords: []
}

let guesses = [];
let compGuesses = [];
let compCurGuess = [];

function fillGrid(grid, coordClass) {

  let refCoord = $("<div>").addClass("refCoord");
  $(grid).append(refCoord);

  for (let i = 1; i <= 10; i++) {

    refCoord = $("<div>").addClass("refCoord");
    $(refCoord).css({marginLeft: (60*i)+"px"});
    $(refCoord).text(String.fromCharCode(64 + i));
    $(grid).append(refCoord);
  }

  for (let i = 1; i <= 10; i++) {

    refCoord = $("<div>").addClass("refCoord");
    $(refCoord).css({marginTop: (60*i)+"px"});
    $(refCoord).text(i);
    $(grid).append(refCoord);

    for (let j = 1; j <= 10; j++) {

      let coord = $("<div>").addClass(coordClass);
      $(coord).css({marginTop: (60*i)+"px", marginLeft: (60*j)+"px"});
      $(grid).append(coord);
    }
  }

}

function remainingShips(fleet) {
  let output = "";

  for (let ship of fleet) {
    let name = ship.name;
    let size = ship.numCoords;
    output = output + name + " (" + size + " squares), "
  }

  return output.substring(0, output.length - 2);
}

function checkCoords(top, left, vertical, ship, coordList) {
  let numCoords = ship.numCoords;
  let shipCoords = [];

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

  ship.coords = shipCoords;
  coords[coordList] = coords[coordList].concat(shipCoords);
  return true;
}

function placeUserShips(fleet, grid) {

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

  $(ship).draggable({opacity: 0.6, grid: [60,60], containment: grid});

  $(ship).dblclick(function() {
    let Top = parseInt($(ship).css("top"));
    let Left = parseInt($(ship).css("left"));
    let tempH = parseInt($(ship).css("height"));
    let tempW = parseInt($(ship).css("width"));

    if (Top + tempW > 655) {
      Top = 660 - (60 * numTiles);
    }
    if (Left + tempH > 655) {
      Left = 660 - (60 * numTiles);
    }
    vertical = !vertical;
    $(ship).css({height: tempW, width: tempH, top: Top, left: Left});
  });

  $(document).keypress(function(e) {

    if (e.which === 13) {
      let Top = Math.round(parseInt($(ship).css("top")) / 60);
      let Left = Math.round(parseInt($(ship).css("left")) / 60);

      if (Top === 0 || Left === 0) {
        $("#instructionBox").text("Please place your ship in the water (blue squares)!");
      } else if (!checkCoords(Top, Left, vertical, fleet[0], "userCoords")) {
        $("#instructionBox").text("Please don't place your ships on top of each other!");
      } else {
        $("#"+shipName).off();
        placeUserShips(fleet.slice(1), grid);
      }
    }
  });
}

function placeCompShips(fleet) {

  if (fleet.length === 0) {
    return;
  }

  let numTiles = fleet[0].numCoords;
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

  if (!checkCoords(top, left, vertical, fleet[0], "compCoords")) {
    placeCompShips(fleet);
  } else {
    placeCompShips(fleet.slice(1));
  }
}

function checkUserHit(x, y, coord, fleet) {
  let letter = String.fromCharCode(64 + x);

  for (let ship of fleet) {
    let index = ship.coords.indexOf(coord);

    if (index > -1) {
      ship.coords.splice(index, 1);

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

  $("#instructionBox").text(`${letter}${y}: Miss!`);
  return false;
}

function userTurn() {
  $("#instructionBox").text("Your turn! Click any blue square on your opponent's grid to fire!");

  $(".compCoord").click(function() {
    let y = Math.round(parseInt($(this).css("marginTop")) / 60);
    let x = Math.round(parseInt($(this).css("marginLeft")) / 60);
    let coord = `${x},${y}`;
    console.log(guesses);

    if (guesses.includes(coord)) {
      $("#instructionBox").text("You've already fired here! Click any blue square on your opponent's grid.");

    } else if (checkUserHit(x, y, coord, compFleet)) {
      $(".compCoord").off();
      $(this).css({background: "#FF0000"});
      guesses.push(coord);

      if (compFleet.length === 0) {
        $("#instructionBox").text("Congratulations! You win! :)");
        return;
      }

      compTurn();
      return;

    } else {
      $(".compCoord").off();
      $(this).css({background: "#FFFFFF"});
      guesses.push(coord);
      compTurn();
      return;
    }
  })
}

function checkCompHit(x, y, coord, fleet) {
  let letter = String.fromCharCode(64 + x);

  for (let ship of fleet) {
    let index = ship.coords.indexOf(coord);

    if (index > -1) {
      ship.coords.splice(index, 1);

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

  $("#instructionBox").text(`Your opponent fired. ${letter}${y}: Miss!`);
  return false;
}

function compGuess() {
  let x;
  let y;
  let coord;

  if (compCurGuess.length === 1) {
    let curCoords = compCurGuess[0].split(",");
    let curX = Number(curCoords[0]);
    let curY = Number(curCoords[1]);
    let rand = Math.floor(Math.random() * 4);
    console.log("curX: ", curX, ", curY: ", curY);

    if (rand === 0) {
      x = curX;
      y = curY - 1;
    } else if (rand === 1) {
      x = curX;
      y = curY + 1;
    } else if (rand === 2) {
      x = curX - 1;
      y = curY;
    } else {
      x = curX + 1;
      y = curY;
    }

    coord = `${x},${y}`;
    console.log("coord: ", coord);

  } else if (compCurGuess.length > 1) {
    let curCoords = compCurGuess[0].split(",");
    let curX = Number(curCoords[0]);
    let curY = Number(curCoords[1]);
    let curCoords2 = compCurGuess[compCurGuess.length - 1].split(",");
    let curX2 = Number(curCoords2[0]);
    let curY2 = Number(curCoords2[1]);

    if (curX === curX2) {
      x = curX;
      maxY = Math.max(curY, curY2);
      minY = Math.min(curY, curY2);
      y = maxY + 1;
      coord = `${x},${y}`;

      if (y > 10 || compGuesses.includes(coord)) {
        y = minY - 1;
        coord = `${x},${y}`;

        if (y < 1 || compGuesses.includes(coord)) {
          compCurGuess = [];
          compGuess();
          return;
        }
      }

    } else {
      y = curY;
      maxX = Math.max(curX, curX2);
      minX = Math.min(curX, curX2);
      x = maxX + 1;
      coord = `${x},${y}`;

      if (x > 10 || compGuesses.includes(coord)) {
        x = minX - 1;
        coord = `${x},${y}`;

        if (x < 1 || compGuesses.includes(coord)) {
          compCurGuess = [];
          compGuess();
          return;
        }
      }
    }

  } else {
    x =  Math.ceil(Math.random() * 10);
    y =  Math.ceil(Math.random() * 10);
    coord = `${x},${y}`;
  }

  if (compGuesses.includes(coord) || x < 1 || x > 10 || y < 1 || y > 10) {
    compGuess();
  } else {
    let hit = checkCompHit(x, y, coord, userFleet);
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

function compTurn() {
  setTimeout(compGuess, 2000);
  setTimeout(userTurn, 5000);
}

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

  $('#newGame').click(function() {
    location.reload();
  });
}