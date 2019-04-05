//
//
//  VARIABLES
//
//
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var prevClick = "none";
var monthColors = {
    Tishrei: "#f74d44",
    Cheshvan: "#a8ee9d",
    Kislev: "#dea9bd",
    Tevet: "#a0a0e2",
    Shrat: "#ff9a35",
    "Adar I": "#e665f3",
    "Adar II": "#00a6a6",
    Nisan: "#800040",
    Iyar: "#0000ff",
    Sivan: "#80ff00",
    Tammuz: "#9445a5",
    Av: "#ffd8b1",
    Elul: "#5bf7d8",
}
var monthHolidaysEtc = {

};
var userEvents = {
};


//
//
//

// getCalendarData();
// setTimeout(createMonth, 250);
// createMonth();


//
//
//  FUNCTIONS
//
//
function createMonth() {
    var table = $("<table>");
    var header = $("<th colspan='7'>");
    var row = $("<tr>");
    var monthOffset = constructedMonth.startDay;
    var maxDay = constructedMonth.hArray.length - 1;

    header.append(createHeaderText());

    table.append(header);

    $("#month").empty();

    for (var day = 0; day < days.length; day++) {
        var data = $("<td class='topDay'>");
        var listedDay = $("<div>");
        var listedDaysText = $("<p class='noMargin'>").text(days[day]);

        listedDay.append(listedDaysText);
        data.append(listedDay);
        row.append(data)
    }

    table.append(row);

    for (var n = 0; n <= maxDay / 7; n++) {
        row = $("<tr>");

        for (var i = 0; i < 7; i++) {
            var currDay = (i + 1) + (7 * n);

            if (currDay <= maxDay && currDay <= constructedMonth.startDay) {
                row.append(createDay("blank"));
            } else if (currDay <= maxDay + monthOffset) {
                row.append(createDay(currDay - monthOffset));
            }
        }

        table.append(row);
    }

    $("#month").append(table);
}


function createDay(currDay) {
    if (currDay !== "blank") {
        var currDayHeb = constructedMonth.hArray[currDay];
        var dayHead = $("<div class='dayHead'>");
        var dayBody = $("<div class='dayBody'>");
        var bodyExclamation = $("<i class='fas fa-exclamation-circle' style='display: none'>");
        var bodyStar = $("<i class='fas fa-star-of-david' style='display: none'>");
        var dayMonth = $(`<p class="noMargin dayMonth" style='background-color: ${monthColors[currDayHeb.hMonth]}'>`);
        var headText = $("<p class='noMargin'>").text(currDay);
        var data = $("<td class='day'>").attr("value", currDay);

        dayHead.append(headText);
        dayBody.append(bodyStar, bodyExclamation);
        dayMonth.text(`${currDayHeb.hMonth} ${currDayHeb.hMonthHebrew}`);
        data.append(dayHead, dayBody, dayMonth);
    } else {
        var data = $("<td>");
    }

    return (data);
}


function createHeaderText() {
    var headerTextGreg = $("<p class='noMargin' style='float: left; line-height: 60px'>").text(month + " " + year);
    var headerTextHebDiv = $("<div style='float: right'>");
    var headerTextHeb = $("<p class='noMargin'>").text(constructedMonth.hMonth + " " + constructedMonth.hYear);
    var headerTextHebTrans = $("<p class='noMargin' style='text-align: right'>").text(constructedMonth.hMonthHebrew + " " + constructedMonth.hYearHebrew);

    headerTextHebDiv.append(headerTextHeb, headerTextHebTrans);

    var headerText = $("<div>").append(headerTextGreg, headerTextHebDiv);

    return headerText;
}

function populateExpandedView(day) {
    var rowPos = Math.floor((parseInt(day) + constructedMonth.startDay - 1) / 7);
    var dayPos = (day - (7 * rowPos)) + 1;
    var currDay = days[dayPos];
    var hebDay = constructedMonth.hArray[day];

    $(".expandedDateGreg").text(`${currDay}, ${month} ${day}, ${year}`);
    $(".expandedDateHeb").text(`${hebDay.hDayHebrew} ${hebDay.hMonthHebrew} ${hebDay.hYearHebrew}`);

    try {
        if (userEvents[month][day] !== undefined) {
            updateDayBody(day);
        } else {
            $("#eventsList").empty();
        }
    } catch {
        updateDayBody();
    }
}

function updateDayBody(day) {
    $("#eventsList").empty();

    if (day) {
        for (events in userEvents[month][day]) {
            var event = $("<li>").text("●" + userEvents[month][day][events]);

            $("#eventsList").append(event);
        }
    }
}

function updateSidebarPanel() {
    $("#userEvents").empty();

    for (day in userEvents[month]) {
        var currHeader = $("<h4 class='sidebarDayHeader noMargin'>").text(month + " " + day);
        var currHeaderContent = $("<ul class='sidebarDayContent noMargin'>")

        for (events in userEvents[month][day]) {
            currHeaderContent.append($("<li>").text("●" + userEvents[month][day][events]));
        }

        $("#userEvents").append(currHeader, currHeaderContent);
    }
}


//
//
//  BUTTONS
//
//
$(".fa-grip-lines-vertical").on("click", function () {
    if ($("#sidebarPanel").is(":visible")) {
        var left = parseInt($("#sidebarPanel").css("width")) / 2;
        $("#floatingView").animate({ left: parseInt($("#floatingView").css("left")) - left }, 250);
    } else {
        var left = parseInt($("#sidebarPanel").css("width")) / 2;
        $("#floatingView").animate({ left: parseInt($("#floatingView").css("left")) + left }, 250);
    }

    $("#sidebarPanel").animate({ width: "toggle", margin: "toggle" }, 250);
});

$(document).on("click", ".day", function () {
    var leftVal = $(this).offset().left + 70;
    var topVal = $(this).offset().top - 80;
    var bgCol = $(this).css("background-color");
    var toPop = $(this)[0].attributes[1].value;

    populateExpandedView(toPop);

    if ($("#floatingView").is(":visible")) {
        if (prevClick === $(this)[0].attributes[1].value) {
            $("#floatingView").animate({ width: "toggle" }, 250);
        } else {
            $("#floatingView").animate({ width: "toggle" }, 250);

            setTimeout(function () {
                $("#floatingView").css({ left: leftVal, top: topVal, "background-color": bgCol });
                $("#floatingView").animate({ width: "toggle" }, 250);
            }, 260);
        }
    } else {
        $("#floatingView").css({ left: leftVal, top: topVal, "background-color": bgCol });
        $("#floatingView").animate({ width: "toggle" }, 250);
    }

    prevClick = $(this)[0].attributes[1].value;
});

$("#addEvent").on("click", function () {
    var rowPos = Math.floor((parseInt(prevClick) + constructedMonth.startDay - 1) / 7);
    var dayPos = (prevClick - (7 * rowPos)) + 1;

    var currDay = days[dayPos];
    var hebDay = constructedMonth.hArray[prevClick];
    $("#eventModal p:nth-child(1)").text(`${currDay}, ${month} ${prevClick}, ${year}`);
    $("#eventModal p:nth-child(2)").text(`${hebDay.hDayHebrew} ${hebDay.hMonthHebrew} ${hebDay.hYearHebrew}`);
});

$("#eventModalSubmit").on("click", function () {
    if (userEvents[month] === undefined) {
        userEvents[month] = {};
        userEvents[month][prevClick] = [$("#eventText").val()];
        $(`td[value="${prevClick}"] .fa-exclamation-circle`).css({ display: "inline-block" });
    } else if (userEvents[month] !== undefined && userEvents[month][prevClick] === undefined) {
        userEvents[month][prevClick] = [$("#eventText").val()];
        $(`td[value="${prevClick}"] .fa-exclamation-circle`).css({ display: "inline-block" });
    } else if (userEvents[month] !== undefined && userEvents[month][prevClick] !== undefined) {
        userEvents[month][prevClick].push($("#eventText").val());
    }

    updateDayBody(prevClick);
    updateSidebarPanel();

    $("#eventText").val("");
    M.Modal.getInstance($("#eventModal")).close();
});