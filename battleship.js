// function Ship(shipName, numTiles) {
//   this.shipName = name;
//   this.numTiles = numTiles;
// }

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
  placeShip("battleship", 4, grid);
}

function placeShip(shipName, numTiles, grid) {

  var ship = $("<div>").attr("id","battleship").addClass("ship");
  $(ship).css({width: 60*numTiles-2});
  $(grid).append(ship);

  $(document).ready(function() {
    $("#battleship").draggable({opacity: 0.6, grid: [60,60]});
  });
}

function click(grid) {
  $(".coord").click(function(){
    $(this).css({background: "#FF0000"});
  });
}