// Global variable definitions
var month;
var year;
var zipCode;

var queryURL;

// Pull data from user input and perform API request; then, perform two functions to return data for page display
$(document).ready(function(event) {
	// Establish arguments based on user input
	month = 4; // Selected month with value as 1-12
	year = 2019; // Selected year
	zipCode = 23219; // Selected ZIP code

	// Establish API request URL
	queryURL = `https://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=${year}&month=${month}&ss=on&mf=on&c=on&geo=zip&zip=${zipCode}&m=50&s=on`;

	console.log(queryURL);

	// Perform AJAX request
	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(response) {
		// Create reference to JSON data
		var data = response.items;

		// Call functions
		getMonthlyData(month, year);

		// Function to get Shabbat data (candle lighting, Havdalah, and Torah portion)
		function getMonthlyData(month, year) {
			// Leap Year detection
			var isLeapYear;
			if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
				isLeapYear = true;
			} else {
				isLeapYear = false;
			}

			// Determine how many days are in the month
			var daysInMonth;

			if (month === 4 || month === 6 || month === 9 || month === 11) {
				daysInMonth = 30;
			} else if (month === 2 && isLeapYear === true) {
				daysInMonth = 29;
			} else if (month === 2 && isLeapYear === false) {
				daysInMonth = 28;
			} else {
				daysInMonth = 31;
			}

			// Create array for candle lighting times
			var candleArray = new Array(daysInMonth + 1);

			// Create array for Havdalah times
			var havdalahArray = new Array(daysInMonth + 1);

			// Create array for Torah portions
			var torahArray = new Array(daysInMonth + 1);

			// Create array for holidays
			var holidaysArray = new Array(daysInMonth + 1);

			// For Loop to loop through response data
			for (var i = 0; i <= data.length - 1; i++) {
				// Store reference for data's associated date
				console.log(data[i].date);
				var date = parseInt(data[i].date.substring(8, 10), 10);
				console.log(date);

				// If Statements for candles, Havdalah, and Torah portions
				if (data[i].category === "candles") {
					var candleTime = data[i].title;
					candleArray.splice(date, 1, candleTime);
				} else if (data[i].category === "havdalah") {
					var havdalahTime = data[i].title;
					havdalahArray.splice(date, 1, havdalahTime);
				} else if (data[i].category === "parashat") {
					var leyning = data[i].leyning;
					var torahPortion = leyning.torah;
					torahArray.splice(date, 1, torahPortion);
				} else if (data[i].category === "holiday") {
					var holidayName = data[i].title;
					holidaysArray.splice(date, 1, holidayName);
				}
			}

			console.log(candleArray);
			console.log(havdalahArray);
			console.log(torahArray);
			console.log(holidaysArray);
		}
	});
});
