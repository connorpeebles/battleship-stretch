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

let coords = [];

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

  console.log("Coords (beginning): ", coords);

  while (numCoords > 0) {
    let coord = `${left},${top}`;

    console.log("Coord: ", coord);

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

  console.log("shipCoords (end): ", shipCoords);
  console.log("Coords (end): ", coords);

  return true;
}

function placeShips(fleet, grid) {

  if (fleet === []) {
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
    // var Top = Math.round(parseInt($("#"+shipName).css("top")) / 60);
    // var Left = Math.round(parseInt($("#"+shipName).css("left")) / 60);

    // if (Top === 0 || Left === 0 || vertical && Top > (11 - numTiles) || !vertical && Left > (11 - numTiles)) {
    //   $("#instructionBox").text("Please place your " + shipName + " within the confines of the grid (on the blue squares).");

    // }
    // else {
    //   for (var i = 0; i < numTiles; i++) {
    //     if (vertical) {
    //       fleet[index].coords.push([Left, Top + i]);
    //     } else {
    //       fleet[index].coords.push([Left + i, Top]);
    //     }
    //   }
    //   return null;
  // }
  });
// }
}

function playBattleship() {

  var userGrid = $("#userGrid")[0];

  fillGrid(userGrid);

  // var carrier = $("<div>").attr("id", "carrier");
  // var battleship = $("<div>").attr("id", "battleship");
  // var cruiser = $("<div>").attr("id", "cruiser");
  // var submarine = $("<div>").attr("id", "submarine");
  // var destroyer = $("<div>").attr("id", "destroyer");

  // fleet[0].jq = carrier;
  // fleet[1].jq = battleship;
  // fleet[2].jq = cruiser;
  // fleet[3].jq = submarine;
  // fleet[4].jq = destroyer;

  placeShips(fleet, userGrid);

  // placeShips(fleet[1].name, fleet[1].numCoords, 1, userGrid);

  // var timeoutID = setTimeout(function() {
  //   placeShips(fleet[1].name, fleet[1].numCoords, 1, userGrid);
  // }, 1000*10);

}

// function click(grid) {
//   $(".coord").click(function(){
//     $(this).css({background: "#FF0000"});
//   });
// }