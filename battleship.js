var fleet = require("./ships");

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

function placeShip(shipName, numTiles, grid) {

  $("#instructionBox").text("Use your mouse to drag and place your " + shipName + ". Double-click with your mouse to switch the ship's orientation. Press ENTER to confirm the ship's location.");

  var ship = $("<div>").attr("id",shipName).addClass("ship");
  $(ship).css({width: 60*numTiles-2});
  $(grid).append(ship);

  var vertical = false;

  $(document).ready(function() {
    $("#"+shipName).draggable({opacity: 0.6, grid: [60,60], containment: grid});
  });
  $("#"+shipName).dblclick(function() {
    var tempH = $(this).css("height");
    var tempW = $(this).css("width");
    vertical = !vertical;
    $(this).css({height: tempW, width: tempH});
  });
  $(document).keypress(function(e) {
    if(e.which == 13) {
      var Top = Math.round(parseInt($("#"+shipName).css("Top")) / 60);
      var Left = Math.round(parseInt($("#"+shipName).css("Left")) / 60);

      for (var i = 0; i < numTiles; i++) {

      }

      $("#instructionBox").text("lol")

      $("#"+shipName).text(Left + ", " + Top);
    }
  });
}

function playBattleship() {
  var userGrid = $("#userGrid")[0];

  fillGrid(userGrid);

  placeShip("battleship", 4, userGrid);
}

function click(grid) {
  $(".coord").click(function(){
    $(this).css({background: "#FF0000"});
  });
}