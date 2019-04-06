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
    Shvat: "#ff9a35",
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
    allHolidays: {}
};
var userEvents = {
};

var uid = null;
var zipcode

var confirmDelete = false;

//
//
//


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
    $(".calendarContainer").css({ display: "flex" });
    updateDailyInfoPanel();
}

function createHeaderText() {
    var headerTextGreg = $("<p class='noMargin' style='float: left; line-height: 60px'>").text(month + " ");
    // var monthSelect = createMonthSelectForm();
    var headerGregYear = $("<p class='noMargin headerYear'>'").text(year);
    var yearSelect = $("<form id='yearSelectForm'><input id='yearSelect' style='display: none'>");
    var selectError = $("<p id='yearSelectError' class='noMargin'>");
    var headerTextHebDiv = $("<div style='float: right'>");
    var headerTextHeb = $("<p class='noMargin'>").text(constructedMonth.hMonth + " " + constructedMonth.hYear);
    var headerTextHebTrans = $("<p class='noMargin' style='text-align: right'>").text(constructedMonth.hMonthHebrew + " " + constructedMonth.hYearHebrew);

    headerTextHebDiv.append(headerTextHeb, headerTextHebTrans);

    var headerText = $("<div>").append(headerTextGreg, headerGregYear, yearSelect, selectError, headerTextHebDiv);

    return headerText;
}

// function createMonthSelectForm() {
//     var form = $("<select class=>")
// }

function createDay(currDay) {
    if (currDay !== "blank") {
        var currDayHeb = constructedMonth.hArray[currDay];
        var dayHead = $("<div class='dayHead'>");
        var dayBody = $("<div class='dayBody'>");
        var icons = populateDailyInfo(currDay);

        var bodyStar = icons[0];
        var bodyExclamation = icons[1];
        if ([6, 13, 20, 27, 34].indexOf((currDay + constructedMonth.startDay)) !== -1) {
            var bodyCandle = $("<i class='fas fa-menorah' style='display: inline-block'>");
        } else {
            var bodyCandle = $("<i class='fas fa-menorah' style='display: none'>");
        }
        var bodyBook = icons[2];

        var dayMonth = $(`<p class="noMargin dayMonth" style='background-color: ${monthColors[currDayHeb.hMonth]}'>`);
        var headText = $("<p class='noMargin'>").text(currDay);
        var data = $("<td class='day'>").attr("value", currDay);

        dayHead.append(headText);
        dayBody.append(bodyStar, bodyExclamation, bodyCandle, bodyBook);
        dayMonth.html(`${currDayHeb.hDay} ${currDayHeb.hMonth} <br> ${currDayHeb.hDayHebrew} ${currDayHeb.hMonthHebrew}`);
        data.append(dayHead, dayBody, dayMonth);
    } else {
        var data = $("<td>");
    }

    return (data);
}

function populateExpandedView(day) {
    var rowPos = Math.floor((parseInt(day) + constructedMonth.startDay - 1) / 7);
    var dayPos = ((parseInt(day) + constructedMonth.startDay) - (7 * rowPos)) - 1;
    var currDay = days[dayPos];
    var hebDay = constructedMonth.hArray[day];

    $("#eventsList").empty();
    $("#holidaysList").empty();
    $("#candleTime").empty();
    $("#passagesList").empty();

    $(".expandedDateGreg").text(`${currDay}, ${month} ${day}, ${year}`);
    $(".expandedDateHeb").text(`${hebDay.hDayHebrew} ${hebDay.hMonthHebrew} ${hebDay.hYearHebrew}`);
    $(".expandedDateHebRoman").text(`${hebDay.hDay} ${hebDay.hMonth} ${hebDay.hYear}`);

    if ($(`td[value="${day}"] .dayBody .fa-exclamation-circle`).is(":visible")) {
        for (events in userEvents[year][month][day]) {
            var event = $("<li>").text("●" + userEvents[year][month][day][events]);

            $("#eventsList").append(event);
        }
    }
    if ($(`td[value="${day}"] .dayBody .fa-star-of-david`).is(":visible")) {
        if (monthHolidaysEtc.holidaysArray[day].lenth > 1) {
            for (holidays in monthHolidaysEtc.holidaysArray) {
                var holiday = $("<li>").text("●" + monthHolidaysEtc.holidaysArray[day][holidays]);

                $("#holidaysList").append(holiday);
            }
        } else {
            var holiday = $("<li>").text("●" + monthHolidaysEtc.holidaysArray[day]);

            $("#holidaysList").append(holiday);
        }
    }
    if ($(`td[value="${day}"] .dayBody .fa-menorah`).is(":visible")) {
        $("#candleTime").text(monthHolidaysEtc.candleArray[parseInt(day)]);
    }
    if ($(`td[value="${day}"] .dayBody .fa-book`).is(":visible")) {
        if (monthHolidaysEtc.torahArray[day].lenth > 1) {
            for (passages in monthHolidaysEtc.torahArray) {
                var passage = $("<li>").text("●" + monthHolidaysEtc.torahArray[day][passages]);

                $("#holidaysList").append(passage);
            }
        } else {
            var passage = $("<li>").text("Passages: " + monthHolidaysEtc.torahArray[day]);

            $("#passagesList").append(passage);
        }
    }
}

function populateDailyInfo(day) {
    var icons = [];

    try {
        if (userEvents[year][month][day] !== undefined) {
            icons[1] = $("<i class='fas fa-exclamation-circle' style='display: inline-block'>");
        } else {
            icons[1] = $("<i class='fas fa-exclamation-circle' style='display: none'>");
        }
    } catch {
        icons[1] = $("<i class='fas fa-exclamation-circle' style='display: none'>");
    }

    if (monthHolidaysEtc.candleArray[day] !== undefined) {
        if (monthHolidaysEtc.allHolidays[day] === undefined) {
            monthHolidaysEtc.allHolidays[day] = [(monthHolidaysEtc.candleArray[day])];
        }
    }

    if (monthHolidaysEtc.havdalahArray[day] !== undefined) {
        if (monthHolidaysEtc.allHolidays[day] === undefined) {
            monthHolidaysEtc.allHolidays[day] = [(monthHolidaysEtc.havdalahArray[day])];
        } else {
            monthHolidaysEtc.allHolidays[day].push(monthHolidaysEtc.havdalahArray[day]);
        }
    }

    if (monthHolidaysEtc.holidaysArray[day] !== undefined) {
        if (monthHolidaysEtc.allHolidays[day] === undefined) {
            monthHolidaysEtc.allHolidays[day] = [(monthHolidaysEtc.holidaysArray[day])];
        } else {
            monthHolidaysEtc.allHolidays[day].push(monthHolidaysEtc.holidaysArray[day]);
        }
        icons[0] = $("<i class='fas fa-star-of-david' style='display: inline-block'>");
    } else {
        icons[0] = $("<i class='fas fa-star-of-david' style='display: none'>");
    }

    if (monthHolidaysEtc.torahArray[day] !== undefined) {
        if (monthHolidaysEtc.allHolidays[day] === undefined) {
            monthHolidaysEtc.allHolidays[day] = [(monthHolidaysEtc.torahArray[day])];
        } else {
            monthHolidaysEtc.allHolidays[day].push(monthHolidaysEtc.torahArray[day]);
        }
        icons[2] = $("<i class='fas fa-book' style='display: inline-block'>");
    } else {
        icons[2] = $("<i class='fas fa-book' style='display: none'>");
    }

    return icons;
}

function updateEventPanel() {
    $("#userEvents").empty();

    if (userEvents[year] === undefined) {
        userEvents[year] = {};
    }

    for (day in userEvents[year][month]) {
        var currHeader = $("<h4 class='sidebarDayHeader noMargin'>").text(month + " " + day);
        var currHeaderContent = $("<ul class='sidebarDayContent noMargin'>")

        for (events in userEvents[year][month][day]) {
            var contentHolder = $("<div>");
            contentHolder.append($("<li>").text("●" + userEvents[year][month][day][events]));
            contentHolder.append($(`<button class='delete' index='${events}' day='${day}'>`).append("<i class='fas fa-minus'>"));

            currHeaderContent.append(contentHolder);
        }

        $("#userEvents").append(currHeader, currHeaderContent);
    }
}

function updateDailyInfoPanel() {
    $("#dailyInfo").empty();

    for (day in monthHolidaysEtc.allHolidays) {
        var currHeader = $("<h4 class='sidebarDayHeader noMargin'>").text(month + " " + day);
        var currHeaderContent = $("<ul class='sidebarDayContent noMargin'>")

        for (events in monthHolidaysEtc.allHolidays[day]) {
            currHeaderContent.append($("<li>").text("●" + monthHolidaysEtc.allHolidays[day][events]));
        }

        $("#dailyInfo").append(currHeader, currHeaderContent);
    }
}

function updateExpandedViewEvents(day) {
    $("#eventsList").empty();

    if ($(`td[value="${day}"] .dayBody .fa-exclamation-circle`).is(":visible")) {
        if (userEvents[year][month][day].length > 0) {
            for (events in userEvents[year][month][day]) {
                var event = $("<li>").text("●" + userEvents[year][month][day][events]);

                $("#eventsList").append(event);
            }
        } else {
            delete userEvents[year][month][day]
            $(`td[value="${day}"] .dayBody .fa-exclamation-circle`).css({ display: "none" });
        }
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
    if (userEvents[year] === undefined) {
        userEvents[year] = {};
    }

    if (userEvents[year][month] === undefined) {
        userEvents[year][month] = {};
        userEvents[year][month][prevClick] = [$("#eventText").val()];
        $(`td[value="${prevClick}"] .fa-exclamation-circle`).css({ display: "inline-block" });
    } else if (userEvents[year][month] !== undefined && userEvents[year][month][prevClick] === undefined) {
        userEvents[year][month][prevClick] = [$("#eventText").val()];
        $(`td[value="${prevClick}"] .fa-exclamation-circle`).css({ display: "inline-block" });
    } else if (userEvents[year][month] !== undefined && userEvents[year][month][prevClick] !== undefined) {
        userEvents[year][month][prevClick].push($("#eventText").val());
    }

    $("#eventsList").empty();
    for (events in userEvents[year][month][prevClick]) {
        var event = $("<li>").text("●" + userEvents[year][month][prevClick][events]);

        $("#eventsList").append(event);
    }

    updateEventPanel();

    $("#eventText").val("");
    M.Modal.getInstance($("#eventModal")).close();

    db.collection("users").doc(uid).update({
        events: userEvents
    });
});

$("#userEvents").on("click", ".delete", function () {
    var index = $(this).attr("index");
    var dayDelete = $(this).attr("day");

    userEvents[year][month][dayDelete].splice(index, 1);

    updateExpandedViewEvents(dayDelete);
    updateEventPanel();

    db.collection("users").doc(uid).update({
        events: userEvents
    });
});

$(document).on("click", ".headerYear", function () {
    $("#yearSelect").val(year);
    $(".headerYear").css({ display: "none" });
    $("#yearSelect").css({ display: "inline-block" });
});

$(document).on("submit", "#yearSelectForm", function (e) {
    e.preventDefault();

    if ($("#yearSelect").val() > 1970) {
        year = parseInt($("#yearSelect").val());

        resetPage();
        resetMonthGlobals();
        constructedMonth = getMonth((numMonth + 1), year);
        getCalendarData();
    } else {
        $("#yearSelectError").text("Please enter a year above 1970.");

        setTimeout(function () {
            $("#yearSelectError").animate({ opacity: 0 }, 2000);
            setTimeout(function () {
                $("#yearSelectError").empty();
                $("#yearSelectError").css({ opacity: 1 });
            }, 2100);
        }, 2500);
    }
});

$(document).on("click", ".fa-chevron-left", function () {
    if ($("#floatingView").is(":visible")) {
        $("#floatingView").css({ display: "none" });
    }

    numMonth -= 1;

    if (numMonth < 0) {
        numMonth = 11;
        year--;
    }
    month = monthArr[numMonth];

    resetPage();
    resetMonthGlobals();
    constructedMonth = getMonth((numMonth + 1), year);
    db.collection("users").doc(uid).get().then(function (snap) {
        try {
            userEvents = snap.data().events;
        } catch {
            console.log("fucked up");
        }
    }).then(function () {
        getCalendarData();
    });
});

$(document).on("click", ".fa-chevron-right", function () {
    if ($("#floatingView").is(":visible")) {
        $("#floatingView").css({ display: "none" });
    }

    numMonth += 1;

    if (numMonth > 11) {
        numMonth = 0;
        year++;
    }
    month = monthArr[numMonth];

    resetPage();
    resetMonthGlobals();
    constructedMonth = getMonth((numMonth + 1), year);
    db.collection("users").doc(uid).get().then(function (snap) {
        try {
            userEvents = snap.data().events;
        } catch {

        }
    }).then(function () {
        getCalendarData();
    });
});

$("#changeZip").on("click", function (e) {
    e.preventDefault();
    M.Modal.getInstance($("#accountModal")).close();
    M.Modal.getInstance($("#changeZipModal")).open();
});

$("#changeZipForm").on("submit", function (e) {
    e.preventDefault();

    if ($.isNumeric($("#newZipInput").val())) {
        zipCode = $("#newZipInput").val();

        db.collection("users").doc(uid).update({
            zipCode: zipCode
        }).then(function () {
            $("#newZipInput").val("");
            M.Modal.getInstance($("#changeZipModal")).close();
        });
    } else {
        alert("Please enter a valid ZIP code.");
    }
});

function resetMonthGlobals() {
    day = new Time(0, 1, 0, 0)
    synodicMonth = new Time(0, 29, 12, 793)
    metonicCycle = synodicMonth.times(235)
    commonYear = synodicMonth.times(12)
    leapYear = synodicMonth.times(13)
}