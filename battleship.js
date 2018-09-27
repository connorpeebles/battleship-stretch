function fillGrid(grid) {

  var coord = $("<div>").addClass("coord");
  $(coord).css({background: "#696969"});
  $(grid).append(coord);

  for (var i = 1; i <= 10; i++) {

    var coord = $("<div>").addClass("coord");
    $(coord).css({background: "#696969", marginLeft: (60*i)+"px"});
    $(coord).text(String.fromCharCode(64 + i));
    $(grid).append(coord);
  }

  for (var i = 1; i <= 10; i++) {

    var coord = $("<div>").addClass("coord");
    $(coord).css({background: "#696969", marginTop: (60*i)+"px"});
    $(coord).text(i);
    $(grid).append(coord);

    for (var j = 1; j <= 10; j++) {

      var coord = $("<div>").addClass("coord");
      $(coord).css({marginTop: (60*i)+"px", marginLeft: (60*j)+"px"});
      $(grid).append(coord);
    }
  }

  $(".coord").click(function(){
    $(this).css({background: "#FF0000"});
  });

}
