//
//
//  VARIABLES
//
//
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];



//
//
//

createMonth(1, "March", [1, 2, 3], 31);

//
//
//  FUNCTIONS
//
//
function createMonth(gregYear, gregMonth, hebArray, maxDay) {
    var table = $("<table>");
    var header = $("<th colspan='7'>").text(gregMonth);
    table.append(header);

    $("#month").empty();

    for (var n = 0; n <= maxDay / 7; n++) {
        var row = $("<tr>");

        for (var i = 0; i < 7; i++) {
            var currDay = (i + 1) + (7 * n);

            if (currDay <= maxDay) {
                var data = $("<td>").attr("value", currDay);
                var dayHead = $('<div class="dayHead">');
                var dayBody = $('<div class="dayBody">');
                var headText = $('<p class="noMargin">').text(currDay);

                dayHead.append(headText);

                data.append(dayHead, dayBody);
                row.append(data);
            }
        }

        table.append(row);
    }

    $("#month").append(table);
}




//
//
//  BUTTONS
//
//
$(".fa-grip-lines-vertical").on("click", function () {
    $("#sidebarPanel").animate({ width: "toggle", margin: "toggle" }, 250);
});