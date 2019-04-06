 //////////////////////////////////////////////////////////////////////////////
 // datelib.js
 // Date conversion library for Hebrew calendar
 //
 // 2218 Wednesday, 3 April 2019 (EDT) [17989]
 //
 // University of Richmond Coding Boot Camp run by Trilogy Education Services
 // Austin Kim
 //
 // Modified:
 //   2121 Thursday, 4 April 2019 (EDT) [17990]
 //   2310 Friday, 5 April 2019 (29 Adar II 5779) [EDT] {17991}
 //   0521 Saturday, 6 April 2019 (1 Nisan 5779) [EDT] {17992}
 //////////////////////////////////////////////////////////////////////////////

 // TIME OBJECT:  Used to represent time durations, intervals, and offsets

 // Time constructor
 function Time(week, day, hour, part) {
    this.week = week
    this.day = day
    this.hour = hour
    this.part = part
  
   // Times method (scalar multiplication)
    this.times = function(multiplier) {
      var product = new Time(multiplier * this.week, multiplier * this.day,
        multiplier * this.hour, multiplier * this.part)
      product.hour += Math.floor(product.part / 1080)
      product.part %= 1080
      product.day += Math.floor(product.hour / 24)
      product.hour %= 24
      product.week += Math.floor(product.day / 7)
      product.day %= 7
      return product}
  
   // toString method (output value as string)
    this.toString = function() {
      var string = this.week.toString() +
        (this.week === 1 ? ' week,' : ' weeks,')
      string += ' ' + this.day.toString() + (this.day === 1 ? ' day,' : ' days,')
      string += ' ' + this.hour.toString() +
        (this.hour === 1 ? ' hour,' : ' hours,')
      string += ' ' + this.part.toString() +
        (this.part === 1 ? ' part' : ' parts')
      return string}
  
    return}                                // End definition of Time object
  
   // UTC DATE OBJECT:  Used to represent points in time (to resolution of 1 part
   //   where 1 part = 1/1080 hour = 1/18 minute = 10/3 seconds)
  
   // UTC date constructor
  function utcDate(year, month, day, hour, minute, part) {
    this.year = year                       // 1970--
    this.month = month                     // 1 = January, ... 12 = December
    this.day = day                         // 1--31
    this.hour = hour                       // 0--23
    this.minute = minute                   // 0--59
    this.part = part                       // 0--17 (18ths of a minute)
    this.utcTime = new Date(0)             // ms since 1 January 1970 (UTC)
    this.utcTime.setUTCFullYear(year)
    this.utcTime.setUTCMonth(month - 1)
    this.utcTime.setUTCDate(day)
    this.utcTime.setUTCHours(hour)
    this.utcTime.setUTCMinutes(minute)
    var seconds = Math.floor(10 * part / 3)
    this.utcTime.setUTCSeconds(seconds)
    var milliseconds = Math.floor(1000 * (10 * part / 3 - seconds) + 0.5)
    this.utcTime.setUTCMilliseconds(milliseconds)
    this.dayOfWeek = this.utcTime.getUTCDay() + 1
    this.hYear = -1                        // Set by only getRoshHashanah()
  
   // Plus method (compute and return UTC date plus Time offset)
    this.plus = function(offset) {
      var jsTime = this.utcTime.getTime()  // Milliseconds since UNIX epoch
      var msOffset = 10000 * (1080 * (24 * (7 * offset.week + offset.day) +
        offset.hour) + offset.part) / 3    // Offset in milliseconds
     // Add one second to mitigate against rounding errors, which then truncate
     //  below (by rounding down to integral part = 1/18 minute = 10/3 seconds)
      var utcTime = new Date(Math.floor(jsTime + msOffset + 1000))
      var part = Math.floor(utcTime.getUTCSeconds() / (10 / 3))
      return new utcDate(
        utcTime.getUTCFullYear(), utcTime.getUTCMonth() + 1,
        utcTime.getUTCDate(), utcTime.getUTCHours(),
        utcTime.getUTCMinutes(), part)
      }
  
   // Minus method (compute and return UTC date minus Time offset)
    this.minus = function(offset) {
      var jsTime = this.utcTime.getTime()  // Milliseconds since UNIX epoch
      var msOffset = 10000 * (1080 * (24 * (7 * offset.week + offset.day) +
        offset.hour) + offset.part) / 3    // Offset in milliseconds
     // Add one second to mitigate against rounding errors, which then truncate
     //   below (by rounding down to integral part = 1/18 minute = 10/3 seconds)
      var utcTime = new Date(Math.floor(jsTime - msOffset + 1000))
      var part = Math.floor(utcTime.getUTCSeconds() / (10 / 3))
      return new utcDate(
        utcTime.getUTCFullYear(), utcTime.getUTCMonth() + 1,
        utcTime.getUTCDate(), utcTime.getUTCHours(),
        utcTime.getUTCMinutes(), part)
      }
  
   // Greater-than-or-equal-to method (return true if UTC date be >= arguments)
    this.ge = function(year, month, day) {
      return (this.year > year ||
        (this.year === year &&
          (this.month > month ||
            (this.month === month && this.day >= day))
          )
        )}
  
   // Greater-than method (return true if UTC date be > arguments)
    this.gt = function(year, month, day) {
      return (this.year > year ||
        (this.year === year &&
          (this.month > month ||
            (this.month === month && this.day > day))
          )
        )}
  
   // Less-than-or-equal-to method (return true if UTC date be <= arguments)
    this.le = function(year, month, day) {
      return (this.year < year ||
        (this.year === year &&
          (this.month < month ||
            (this.month === month && this.day <= day))
          )
        )}
  
   // Less-than method (return true if UTC date be < arguments)
    this.lt = function(year, month, day) {
      return (this.year < year ||
        (this.year === year &&
          (this.month < month ||
            (this.month === month && this.day < day))
          )
        )}
  
   // toString method (output value as string)
    this.toString = function() {
      var string = Math.floor(this.hour / 10).toString() +
        (this.hour % 10).toString() + ':' +
        Math.floor(this.minute / 10).toString() +
        (this.minute % 10).toString() + ' '
      if (this.part !== 0) string += this.part.toString() + '/18 '
      switch (this.dayOfWeek) {
        case 1:  string += 'Sunday, '
          break
        case 2:  string += 'Monday, '
          break
        case 3:  string += 'Tuesday, '
          break
        case 4:  string += 'Wednesday, '
          break
        case 5:  string += 'Thursday, '
          break
        case 6:  string += 'Friday, '
          break
        case 7:  string += 'Saturday, '
          }
      string += this.day.toString() + ' '
      switch (this.month) {
        case 1:  string += 'January '
          break
        case 2:  string += 'February '
          break
        case 3:  string += 'March '
          break
        case 4:  string += 'April '
          break
        case 5:  string += 'May '
          break
        case 6:  string += 'June '
          break
        case 7:  string += 'July '
          break
        case 8:  string += 'August '
          break
        case 9:  string += 'September '
          break
        case 10:  string += 'October '
          break
        case 11:  string += 'November '
          break
        case 12:  string += 'December '
          }
      string += this.year.toString()
      return string}
  
    return}                                // End definition of utcDate object
  
   // GLOBAL DEFINITIONS
  
   // Define fundamental intervals
  
  var day = new Time(0, 1, 0, 0)
  
  var synodicMonth = new Time(0, 29, 12, 793)
   // console.log(`synodicMonth = ${synodicMonth.toString()}`)
   // Prints:  "synodicMonth = 0 weeks, 29 days, 12 hours, 793 parts"
  
  var metonicCycle = synodicMonth.times(235)
   // console.log(`metonicCycle = ${metonicCycle.toString()}`)
   // Prints:  "metonicCycle = 991 weeks, 2 days, 16 hours, 595 parts"
  
  var commonYear = synodicMonth.times(12)
   // console.log(`commonYear = ${commonYear.toString()}`)
   // Prints:  "commonYear = 50 weeks, 4 days, 8 hours, 876 parts"
  
  var leapYear = synodicMonth.times(13)
   // console.log(`leapYear = ${leapYear.toString()}`)
   // Prints:  "leapYear = 54 weeks, 5 days, 21 hours, 589 parts"
  
   // Set our reference spring molad = 17:50 5/18 Friday, 5 April 2019
   //   - According to https://en.wikipedia.org/wiki/Hebrew_calendar
   // var moladSpring5779 = new utcDate(2019, 4, 5, 17, 50, 5)
  
   // Set our reference spring molad = 01:25 17/18 Friday, 5 April 2019
   //   - According to both https://www.torahcalc.com/molad/ and
   // https://www.chabad.org/library/article_cdo/aid/216238/jewish/Molad-Times.htm
  var moladSpring5779 = new utcDate(2019, 4, 5, 1, 25, 17)
  
   // Test utcDate
   // console.log(`Spring molad 5779 = ${moladSpring5779.toString()}`)
   // Prints:  "Spring molad 5779 = 01:25 17/18 Friday, 5 April 2019 (UTC)"
  
   // UTILITY FUNCTIONS
  
   // isLeapYear(year):  Return true if (Hebrew) year be leap year, false otherw.
  function isLeapYear(year) {
    var remainder = (7 * year + 1) % 19
    return remainder < 7}
  
   // Test our molad calculation code
  
   // console.log('Going backwards:')
   // var moladSpring = moladSpring5779
   // for (var year = 5778; year >= 5774; --year) {
   //   if (isLeapYear(year + 1)) moladSpring = moladSpring.minus(leapYear)
   //     else moladSpring = moladSpring.minus(commonYear)
   //   console.log(`Spring molad ${year} = ${moladSpring}`)}
  
   // console.log('Going forwards:')
   // moladSpring = moladSpring5779
   // for (var year = 5780; year <= 5798; ++ year) {
   //   if (isLeapYear(year)) moladSpring = moladSpring.plus(leapYear)
   //     else moladSpring = moladSpring.plus(commonYear)
   //   console.log(`Spring molad ${year} = ${moladSpring}`)}
  
   // getMoladTishrei(gYear):  Get molad Tishrei in specified Gregorian year
  function getMoladTishrei(gYear) {
    var hYear = 3761 + gYear               // E.g., A.M. 5780 starts in C.E. 2019
    var synodicOffset = 6                  // Our reference spring molad is 5779,
    var yearOffset = hYear - 5780          //   which precedes molad Tishrei 5780
    var metonicOffset                      // Offset in 19-year Metonic cycles
    var hYearCurrent                       // Hebrew year incrementer/decrementer
    if (yearOffset <= -19) {               // Go back at least one Metonic cycle
      metonicOffset = Math.floor(-yearOffset / 19)
      synodicOffset -= 235 * metonicOffset
      hYearCurrent = 5780 - 19 * metonicOffset}
      else if (yearOffset >= 19) {         // Go forward at last one Metonic cycle
        metonicOffset = Math.floor(yearOffset / 19)
        synodicOffset += 235 * metonicOffset
        hYearCurrent = 5780 + 19 * metonicOffset}
        else hYearCurrent = 5780
    if (hYear < hYearCurrent)              // Go back year by year until hYear
      while (hYearCurrent !== hYear)
        if (isLeapYear(--hYearCurrent)) synodicOffset -= 13
          else synodicOffset -= 12
      else if (hYear > hYearCurrent)       // Go forward year by year until hYear
        while (hYearCurrent !== hYear)
          if (isLeapYear(hYearCurrent++)) synodicOffset += 13
            else synodicOffset += 12
    var synodicOffsetTime                  // Time object representing syn. offset
    if (synodicOffset < 0) {
      synodicOffsetTime = synodicMonth.times(-synodicOffset)
      return moladSpring5779.minus(synodicOffsetTime)}
      else if (synodicOffset > 0) {
        synodicOffsetTime = synodicMonth.times(synodicOffset)
        return moladSpring5779.plus(synodicOffsetTime)}
        else return moladSpring5779}       // This last case should not occur
  
   // getRoshHashanah(moladTishrei):  Get date of Rosh Hashanah given molad Tishr.
  function getRoshHashanah(moladTishrei) {
    var hYear = 3761 + moladTishrei.year   // Corresponding Hebrew year
    var moladAdjusted                      // Adjusted to obtain Rosh Hashanah
   // Rosh Hashanah Postponement Rule No. 1:  If molad Tishrei occur at or later
   //   than noon, Rosh Hashanah is postponed a day (= "dehiyyat molad zaken,"
   //   or `postponement of an old molad').
    if (moladTishrei.hour >= 12) {
      moladAdjusted = moladTishrei.plus(day)
      moladAdjusted.hour = 0               // Zero out hour,
      moladAdjusted.utcTime.setUTCHours(0) //   ...
      moladAdjusted.minute = 0             //   minute,
      moladAdjusted.utcTime.setUTCMinutes(0)
      moladAdjusted.part = 0               //   and part
      moladAdjusted.utcTime.setUTCSeconds(0)
      moladAdjusted.utcTime.setUTCMilliseconds(0)}
      else moladAdjusted = moladTishrei
   // Rosh Hashanah Postponement Rule No. 2:  Yom Kippur (10 Tishrei) should not
   //   fall on a Friday (because then you could not prepare for Shabbat the next
   //   day, since Friday would be Yom Kippur) or on a Sunday (because then you
   //   could not prepare for Yom Kippur, since the previous day would be
   //   Shabbat); therefore, Rosh Hashanah (1 Tishrei) must not fall on a
   //   Wednesday or Friday.  In addition, Hoshana Rabbah (21 Tishrei), which
   //   involves some work, should not fall on Shabbat (when work is forbidden);
   //   therefore, Rosh Hashanah (1 Tishrei) should not fall on a Sunday.
   //   Therefore, if molad Tishrei occur on a Sunday, Wednesday, or Friday, Rosh
   //   Hashanah is postponed a day (= "dehiyyat lo ADU," or `non-1/4/6
   //   postponement,' where `1/4/6' refers to `Sunday/Wednesday/Friday').
   //   Note that we use moladAdjusted (not the original moladTishrei), because
   //   this rule is applied after applying postponement rule no. 1
    if (moladAdjusted.dayOfWeek === 1 || moladAdjusted.dayOfWeek === 4 ||
      moladAdjusted.dayOfWeek === 6) moladAdjusted = moladAdjusted.plus(day)
   // Rosh Hashanah Postponement Rule No. 3:  If the molad in a common (non-leap)
   //   year fall on a Tuesday after 9 hours and 204 parts (since sundown, taken
   //   to be 1800 the previous evening; which corresponds to 03:11 6/18 on the
   //   molad), Rosh Hashanah is postponed to Thursday (= "dehiyyat GaTRaD," or
   //   `3 (Tuesday)-9-204 postponement').
      else if (isLeapYear(hYear) === false && moladAdjusted.dayOfWeek === 3 &&
        (moladAdjusted.hour > 3 ||
          (moladAdjusted.hour === 3 &&
            (moladAdjusted.minute > 11 ||
              (moladAdjusted.minute === 11 && moladAdjusted.part >= 6))
            )
          )
        ) moladAdjusted = moladAdjusted.plus(day.times(2))
   // Rosh Hashanah Postponement Rule No. 4:  If the molad following a leap year
   //   fall on a Monday after 15 hours and 589 parts (since sundown, taken to be
   //   1800 on the previous evening, which corresponds to 09:32 13/18 on the
   //   molad), Rosh Hashanah is postponed to Tuesday (= "dehiyyat BeTU-teKPaT,"
   //   or `2 (Monday)-15-589 postponement').
        else if (isLeapYear(hYear-1) === true && moladAdjusted.dayOfWeek === 2 &&
          (moladAdjusted.hour > 9 ||
            (moladAdjusted.hour === 9 &&
              (moladAdjusted.minute > 32 ||
                (moladAdjusted.minute === 32 && moladAdjusted.part >= 13))
              )
            )
          ) moladAdjusted = moladAdjusted.plus(day)
   // Now that we have the date of Rosh Hashanah, zero out...
    moladAdjusted.hour = 0                 // the hour,
    moladAdjusted.utcTime.setUTCHours(0)   // ...
    moladAdjusted.minute = 0               // minute,
    moladAdjusted.utcTime.setUTCMinutes(0) // ...
    moladAdjusted.part = 0                 // and part
    moladAdjusted.utcTime.setUTCSeconds(0) // ...
    moladAdjusted.utcTime.setUTCMilliseconds(0)
   // Set hYear in UTC date object (this is the only function that sets hYear)
    moladAdjusted.hYear = 3761 + moladAdjusted.year
    return moladAdjusted}
  
   // Test getMoladTishrei() and getRoshHashanah() code
   // var metonicYear, moladTishrei, roshHashanah
   // console.log('Molad Tishrei and Rosh Hashanah Tests:')
   // for (var year = 2016; year !== 2016 + 19; ++year) {
   //   metonicYear = (3761 + year) % 19
   //   if (metonicYear === 0) metonicYear = 19
   //   moladTishrei = getMoladTishrei(year)
   //   roshHashanah = getRoshHashanah(moladTishrei)
   //   console.log('Year ' + (3761 + year).toString() + ' (Metonic year ' +
   //     metonicYear.toString() + '):  Molad Tishrei = ' + moladTishrei +
   //     '; Rosh Hashanah = ' + roshHashanah)}
  
   // getMostRecentRoshHashanah(year, month, day):  Get most recent Rosh HaShanah
  function getMostRecentRoshHashanah(year, month, day) {
    var moladTishrei = getMoladTishrei(year)
    var roshHashanah = getRoshHashanah(moladTishrei)
    if (roshHashanah.gt(year, month, day)) {
      var moladTishrei = getMoladTishrei(year - 1)
      var roshHashanah = getRoshHashanah(moladTishrei)}
    return roshHashanah}
  
   // daysBetweenDates(date0, date1):  Return number of days from date0 to date1
  function daysBetweenDates(date0, date1) {
    var milliseconds = date1.utcTime.getTime() - date0.utcTime.getTime()
    return Math.floor(milliseconds / 1000 / 60 / 60 / 24 + 0.5)}
  
   // getMonthsArray(roshHashanah0, roshHashanah1):  Get lengths of Hebrew months
  function getMonthsArray(roshHashanah0, roshHashanah1) {
    var yearLength = daysBetweenDates(roshHashanah0, roshHashanah1)
    var monthsArray = []
    monthsArray[7] = 30                    // Tishrei (Rosh Hashanah)
    if (yearLength !== 355 && yearLength !== 385) monthsArray[8] = 29
      else monthsArray[8] = 30             // Cheshvan
    if (yearLength !== 353 && yearLength !== 383) monthsArray[9] = 30
      else monthsArray[9] = 29             // Kislev
    monthsArray[10] = 29                   // Tevet
    monthsArray[11] = 30                   // Shvat
    if (yearLength >= 383) {               // Leap year:
      monthsArray[12] = 0                  //   (Adar is replaced by:)
      monthsArray[13] = 30                 //   Adar I
      monthsArray[14] = 29}                //   Adar II
      else monthsArray[12] = 29            // Adar
    monthsArray[1] = 30                    // Nisan
    monthsArray[2] = 29                    // Iyar
    monthsArray[3] = 30                    // Sivan
    monthsArray[4] = 29                    // Tammuz
    monthsArray[5] = 30                    // Av
    monthsArray[6] = 29                    // Elul
    return monthsArray}
  
   // increment(hMonth, monthsArray):  Return index of next month; 0 if end/year
  function increment(hMonth, monthsArray) {
    if (hMonth >= 7 && hMonth < 11) return hMonth + 1
      else if (hMonth === 11) return monthsArray[12] === 0 ? 13 : 12
        else if (hMonth === 12) return 1
          else if (hMonth === 13) return 14
            else if (hMonth === 14) return 1
              else if (hMonth >= 1 && hMonth < 6) return hMonth + 1
                else return 0}
  
   // getDaysInMonth(month, year):  Return number of days in the Gregorian month
  function getDaysInMonth(month, year) {
    switch (month) {
      case 1:  return 31                   // January
      case 2:  if (year % 4 === 0)         // February
        if (year % 100 === 0)
          if (year % 400 === 0) return 29
            else return 28
          else return 29
        else return 28
      case 3:  return 31                   // March
      case 4:  return 30                   // April
      case 5:  return 31                   // May
      case 6:  return 30                   // June
      case 7:  return 31                   // July
      case 8:  return 31                   // August
      case 9:  return 30                   // September
      case 10:  return 31                  // October
      case 11:  return 30                  // November
      case 12:  return 31}                 // December
    }
  
   // MONTH NAMES AND HEBREW FUNCTIONS
  
   // Names of Hebrew months
   // Hebrew months in English            Hebrew months in Hebrew
  var months = [];                        var monthsHebrew = []
    months[7] = 'Tishrei';                  monthsHebrew[7] = 'בְּתִשְׁרֵי'
    months[8] = 'Cheshvan';                 monthsHebrew[8] = 'בְּחֶשְׁוָן'
    months[9] = 'Kislev';                   monthsHebrew[9] = 'בְּכִסְלֵו'
    months[10] = 'Tevet';                   monthsHebrew[10] = 'בְּטֵבֵת'
    months[11] = 'Shvat';                   monthsHebrew[11] = 'בִּשְׁבָט'
    months[12] = 'Adar';                    monthsHebrew[12] = 'בַּאֲדָר'
    months[13] = 'Adar I';                  monthsHebrew[13] = 'בַּאֲדָר א’'
    months[14] = 'Adar II';                 monthsHebrew[14] = 'בַּאֲדָר ב’'
    months[1] = 'Nisan';                    monthsHebrew[1] = 'בְּנִיסָן'
    months[2] = 'Iyar';                     monthsHebrew[2] = 'בְּאִיָּר'
    months[3] = 'Sivan';                    monthsHebrew[3] = 'בְּסִיוָן'
    months[4] = 'Tammuz';                   monthsHebrew[4] = 'בְּתַמּוּז'
    months[5] = 'Av';                       monthsHebrew[5] = 'בְּאָב'
    months[6] = 'Elul';                     monthsHebrew[6] = 'בֶּאֱלוּל'
  
   // hebrewNumerals(n):  Return n expressed in Hebrew numerals
  function hebrewNumerals(n) {
    var onesArray = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט']
    var tensArray = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ']
    var hundredsArray = ['', 'ק', 'ר', 'ש', 'ת']
    var thousands = Math.floor(n % 10000 / 1000)
    var hundreds = Math.floor(n % 1000 / 100)
    var tens = Math.floor(n % 100 / 10)
    var ones = Math.floor(n % 10)
    var string = ''
   // Hundreds digit(s)
    if (hundreds >= 4) {
      string += hundredsArray[4]
      hundreds -= 4}
    if (hundreds >= 4) {
      string += hundredsArray[4]
      hundreds -= 4}
    if (hundreds >= 1) string += hundredsArray[hundreds]
   // Handle special cases of 15 & 16
    if (n % 100 === 15) string += onesArray[9] + onesArray[6]
      else if (n % 100 === 16) string += onesArray[9] + onesArray[7]
        else {
   // Tens digit
          if (tens >= 1) string += tensArray[tens]
   // Ones digit
          if (ones >= 1) string += onesArray[ones]}
   // Geresh vs. gershayim
    if (string.length === 1) string += '’'
      else if (string.length > 1)
        string = string.substring(0, string.length - 1) + '”' +
                 string.substring(string.length - 1)
   // Thousands digit
    if (thousands >= 1)
      if (string.length >= 1) string = onesArray[thousands] + '’' + string
        else string = onesArray[thousands] + '”'
    return string}
  
   // GETMONTH()
  
   // getMonth(month, year):  Return monthObject in format shown further below
  function getMonth(month, year) {
   // Initialize the number of days in the requested Gregorian month
    var daysInMonth = getDaysInMonth(month, year)
   // Create a utcDate object for the first day of the (Gregorian) month
    var firstDay = new utcDate(year, month, 1, 0, 0, 0)
   // Get date of most-recent Rosh Hashanah (today or earlier)
    var roshHashanah0 = getMostRecentRoshHashanah(year, month, 1)
    var hYear0 = roshHashanah0.hYear
   // Get date of next Rosh Hashanah
    var moladTishrei = getMoladTishrei(hYear0 - 3760)
    var roshHashanah1 = getRoshHashanah(moladTishrei)
    var hYear1 = roshHashanah1.hYear
   // Get month lengths for the current Hebrew year
    var monthsArray = getMonthsArray(roshHashanah0, roshHashanah1)
   // Skip over months to month with firstDay
    var hMonth = 7                         // Start at first month = Tishrei
    var daysTilFirst = daysBetweenDates(roshHashanah0, firstDay)
    while (daysTilFirst >= monthsArray[hMonth]) {
      daysTilFirst -= monthsArray[hMonth]
      hMonth = increment(hMonth, monthsArray)}
   // Advance to day in Hebrew month corresponding to first day of Gregor'n month
    var hDay = 1 + daysTilFirst
   // Set top-level elements in monthObject
    var monthObject = {
      startDay: firstDay.dayOfWeek - 1,        // Day of the week the month starts
      hMonth: months[hMonth],              // Corresponding Hebrew month(s)
      hYear: hYear0.toString(),            // Corresponding Hebrew year(s)
      hMonthHebrew: monthsHebrew[hMonth].substring(3), // Hebrew month(s) in Heb.
      hYearHebrew: hebrewNumerals(hYear0)} // Corresp'g Hebrew year(s) in Hebrew
   // Now walk through the days of the Gregorian month, building hArray as you go
    var hArray = []
    for (var gDay = 1; gDay <= daysInMonth; ++gDay) {
      hArray[gDay] = {
        hYear: hYear0,                     // Hebrew year (integer)
        hMonth: months[hMonth],            // Hebrew month (string)
        hDay: hDay,                        // Day no. of Hebrew month (integer)
        hYearHebrew: hebrewNumerals(hYear0), // Hebrew year in Hebrew (string)
        hMonthHebrew: monthsHebrew[hMonth],  // Hebrew month in Hebrew (string)
        hDayHebrew: hebrewNumerals(hDay)}  // Hebrew day in Hebrew (string)
   // Now increment the day of the Hebrew month
      if (hDay < monthsArray[hMonth]) ++hDay
     // Increment the Hebrew month
        else {
          hMonth = increment(hMonth, monthsArray)
       // Increment the Hebrew year
          if (hMonth === 0) {
            roshHashanah0 = roshHashanah1
            hYear0 = hYear1
         // Get date of next Rosh Hashanah
            moladTishrei = getMoladTishrei(hYear0 - 3760)
            roshHashanah1 = getRoshHashanah(moladTishrei)
            hYear1 = roshHashanah1.hYear
         // Get month lengths for the new Hebrew year
            monthsArray = getMonthsArray(roshHashanah0, roshHashanah1)
         // Reset Hebrew month and day numbers
            hMonth = 7                     // Restart at first month = Tishrei
         // Update/append to year in top-level elements in monthObject
            monthObject.hYear += '/' + hYear0.toString() // Hebrew year(s)
            monthObject.hYearHebrew += '/' + hebrewNumerals(hYear0) // Year in Heb
            } // if (hMonth === 0)
         // Update/append to month in top-level elements in monthObject
          monthObject.hMonth += '/' + months[hMonth] // Hebrew month(s)
          monthObject.hMonthHebrew += '/' + monthsHebrew[hMonth].substring(3)
          hDay = 1}                        // Reset day of (Hebrew) month
      } // for (var gDay ...
   // Add hArray to monthObject
    monthObject.hArray = hArray
    return monthObject}

    
    var d = new Date();
    var monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var numMonth = d.getMonth();
    var month = monthArr[numMonth];
    var year = d.getFullYear();
    var zipCode = null;
    var constructedMonth;
