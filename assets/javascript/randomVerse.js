// Pull data from user input and perform API request
function randomVerse() {
  // Generate random number for book
  var book = Math.floor((Math.random() * 5) + 1);
  console.log(book);

	// Establish API request URL
	var queryURL = `http://quotes.rest/bible/verse.json?book=${book}`;

	console.log(queryURL);

	// Perform AJAX request
	$.ajax({
		url: queryURL,
		method: "GET"
  }).then(function (response) {
    // Create reference to data returned
    var data = response.contents;

    // Create references to verse, book, chapter, and verse number
    var randomVerse = data.verse;
    var bookChapVerse = data.book + " " + data.chapter + ":" + data.number;

    var fullVerse = randomVerse + "–" + bookChapVerse;

    console.log(fullVerse);
	});
}
