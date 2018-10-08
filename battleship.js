const fleet = [
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

let coords = [];
let compCoords = [];
let guesses = [];
let compGuesses = [];
let compCurGuess = [];

function fillGrid(grid) {

  let refCoord = $("<div>").addClass("ref");
  $(grid).append(refCoord);

  for (let i = 1; i <= 10; i++) {

    refCoord = $("<div>").addClass("ref");
    $(refCoord).css({marginLeft: (60*i)+"px"});
    $(refCoord).text(String.fromCharCode(64 + i));
    $(grid).append(refCoord);
  }

  for (let i = 1; i <= 10; i++) {

    refCoord = $("<div>").addClass("ref");
    $(refCoord).css({marginTop: (60*i)+"px"});
    $(refCoord).text(i);
    $(grid).append(refCoord);

    for (let j = 1; j <= 10; j++) {

      let coord = $("<div>").addClass("coord");
      $(coord).css({marginTop: (60*i)+"px", marginLeft: (60*j)+"px"});
      $(grid).append(coord);
    }
  }

}

function checkCoords(top, left, vertical, ship) {
  let numCoords = ship.numCoords;
  let shipCoords = [];

  while (numCoords > 0) {
    let coord = `${left},${top}`;

    if (coords.includes(coord)) {
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
  coords = coords.concat(shipCoords);
  return true;
}

function checkCompCoords(top, left, vertical, ship) {
  let numCoords = ship.numCoords;
  let shipCoords = [];

  while (numCoords > 0) {
    let coord = `${left},${top}`;

    if (compCoords.includes(coord)) {
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
  compCoords = compCoords.concat(shipCoords);
  return true;
}

function placeShips(fleet, grid) {

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

    if(e.which === 13) {
      let Top = Math.round(parseInt($(ship).css("top")) / 60);
      let Left = Math.round(parseInt($(ship).css("left")) / 60);

      if (Top === 0 || Left === 0) {
        $("#instructionBox").text("Please place your ship in the water (blue squares)!");
      } else if (!checkCoords(Top, Left, vertical, fleet[0])) {
        $("#instructionBox").text("Please don't place your ships on top of each other!");
      } else {
        $("#"+shipName).off();
        placeShips(fleet.slice(1), grid);
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

  if (!checkCompCoords(top, left, vertical, fleet[0])) {
    placeCompShips(fleet);
  } else {
    placeCompShips(fleet.slice(1));
  }
}

function checkHit(coord, fleet) {

  for (let ship of fleet) {
    let index = ship.coords.indexOf(coord);

    if (index > -1) {
      ship.coords.splice(index, 1);

      if (ship.coords.length === 0) {
        let shipName = ship.name;
        index = fleet.indexOf(ship);
        fleet.splice(index,1);
        $("#instructionBox").text(`Hit! You sunk your opponent's ${shipName}!`);
      } else {
        $("#instructionBox").text(`Hit!`);
      }

      return true;
    }
  }

  $("#instructionBox").text(`Miss!`);
  return false;
}

function checkCompHit(coord, fleet) {

  for (let ship of fleet) {
    let index = ship.coords.indexOf(coord);

    if (index > -1) {
      ship.coords.splice(index, 1);

      if (ship.coords.length === 0) {
        let shipName = ship.name;
        index = fleet.indexOf(ship);
        fleet.splice(index,1);
        compCurGuess = [];
        $("#instructionBox").text(`Your opponent fired and sunk your ${shipName}!`);
      } else {
        compCurGuess.push(coord);
        $("#instructionBox").text(`Your opponent fired! It was a hit!`);
      }

      return true;
    }
  }

  $("#instructionBox").text(`Your opponent fired! It was a miss!`);
  return false;
}

function userTurn() {
  $("#instructionBox").text("Your turn! Click any blue square on your opponent's grid to fire!");

  $(".coord").click(function() {
    let y = Math.round(parseInt($(this).css("marginTop")) / 60);
    let x = Math.round(parseInt($(this).css("marginLeft")) / 60);
    let coord = `${x},${y}`;

    if (guesses.includes(coord)) {
      $("#instructionBox").text("You've already fired here! Click any blue square on your opponent's grid.");
    } else if (checkHit(coord, compFleet)) {
      $(".coord").off();
      $(this).css({background: "#FF0000"});
      guesses.push(coord);

      if (compFleet.length === 0) {
        $("#instructionBox").text("Congratulations! You win! :)");
        return;
      }

      compTurn();
      return;

    } else {
      $(".coord").off();
      $(this).css({background: "#FFFFFF"});
      guesses.push(coord);
      compTurn();
      return;
    }
  })
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

      if (maxY > 10 || compGuesses.includes(coord)) {
        y = minY - 1;
        coord = `${x},${y}`;

        if (minY < 1 || compGuesses.includes(coord)) {
          compCurGuess = [];
          compGuess();
        }
      }

    } else {
      y = curY;
      maxX = Math.max(curX, curX2);
      minX = Math.min(curX, curX2);
      x = maxX + 1;
      coord = `${x},${y}`;

      if (maxX > 10 || compGuesses.includes(coord)) {
        x = minX - 1;
        coord = `${x},${y}`;

        if (minX < 1 || compGuesses.includes(coord)) {
          compCurGuess = [];
          compGuess();
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
    let hit = checkCompHit(coord, fleet);
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
  setTimeout(userTurn, 4000);
}

function playBattleship() {

  let userGrid = $("#userGrid")[0];
  let compGrid = $("#compGrid")[0];

  fillGrid(userGrid);
  fillGrid(compGrid);

  placeShips(fleet, userGrid);
  placeCompShips(compFleet);
  console.log(compFleet);

}

// function click(grid) {
//   $(".coord").click(function(){
//     $(this).css({background: "#FF0000"});
//   });
// }