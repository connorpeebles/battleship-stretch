module.exports = {
  fleet: [
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
  ]
};