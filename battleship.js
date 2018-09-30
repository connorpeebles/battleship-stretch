var fleet = [
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

function fillGrid(grid) {

  var refCoord = $("<div>").addClass("ref");
  $(grid).append(refCoord);

  for (var i = 1; i <= 10; i++) {

    refCoord = $("<div>").addClass("ref");
    $(refCoord).css({marginLeft: (60*i)+"px"});
    $(refCoord).text(String.fromCharCode(64 + i));
    $(grid).append(refCoord);
  }

  for (var i = 1; i <= 10; i++) {

    refCoord = $("<div>").addClass("ref");
    $(refCoord).css({marginTop: (60*i)+"px"});
    $(refCoord).text(i);
    $(grid).append(refCoord);

    for (var j = 1; j <= 10; j++) {

      var coord = $("<div>").addClass("coord");
      $(coord).css({marginTop: (60*i)+"px", marginLeft: (60*j)+"px"});
      $(grid).append(coord);
    }
  }

}

function placeShips(shipName, numTiles, index, grid) {

  if (index === 4) {
    $("#instructionBox").text("Done");
    return null;
  }

  $("#instructionBox").text("Use your mouse to drag and place your \"" + shipName + "\" ship. Double-click the ship with your mouse to switch the ship's orientation. Press any key to confirm the ship's location.");

  var ship = $("<div>").attr("id",shipName).addClass("ship");
  $(ship).css({width: 60*numTiles-2});
  $(grid).append(ship);

  var vertical = false;

  $("#"+shipName).draggable({opacity: 0.6, grid: [60,60], containment: grid});

  $("#"+shipName).dblclick(function() {
    var Top = parseInt($(this).css("top"));
    var Left = parseInt($(this).css("left"));
    var tempH = parseInt($(this).css("height"));
    var tempW = parseInt($(this).css("width"));

    if (Top + tempW > 655) {
      Top = 660 - (60 * numTiles);
    }
    if (Left + tempH > 655) {
      Left = 660 - (60 * numTiles);
    }
    vertical = !vertical;
    $(this).css({height: tempW, width: tempH, top: Top, left: Left});
  });

  $(document).keypress(function() {
    var Top = Math.round(parseInt($("#"+shipName).css("top")) / 60);
    var Left = Math.round(parseInt($("#"+shipName).css("left")) / 60);

    if (Top === 0 || Left === 0 || vertical && Top > (11 - numTiles) || !vertical && Left > (11 - numTiles)) {
      $("#instructionBox").text("Please place your " + shipName + " within the confines of the grid (on the blue squares).");

    }
    else {
      for (var i = 0; i < numTiles; i++) {
        if (vertical) {
          fleet[index].coords.push([Left, Top + i]);
        } else {
          fleet[index].coords.push([Left + i, Top]);
        }
      }
      $("#"+shipName).off();
      $(document).off();
      return null;
  }
  });
}

function playBattleship() {
  var userGrid = $("#userGrid")[0];

  fillGrid(userGrid);

  placeShips(fleet[0].name, fleet[0].numCoords, 0, userGrid);

  // placeShips(fleet[1].name, fleet[1].numCoords, 1, userGrid);

}

function click(grid) {
  $(".coord").click(function(){
    $(this).css({background: "#FF0000"});
  });
}