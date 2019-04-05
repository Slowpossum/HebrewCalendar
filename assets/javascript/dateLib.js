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
//////////////////////////////////////////////////////////////////////////////

// TEMPORARY MOCK-UP FUNCTION FOR PRELIMINARY FRONT-END DEVELOPMENT

function getMonth(month, year) {
    hArray[1] = {
        hYear: 5779,
        hMonth: 'Adar II',
        hDay: 25,
        hYearHebrew: 'התשע״ט',
        hMonthHebrew: 'באדר ב׳',
        hDayHebrew: 'כ״ה'
    }
    hArray[2] = {
        hYear: 5779,
        hMonth: 'Adar II',
        hDay: 26,
        hYearHebrew: 'התשע״ט',
        hMonthHebrew: 'באדר ב׳',
        hDayHebrew: 'כ״ו'
    }
    for (i = 3; i != 31; ++i) hArray[i] = hArray[2]
    monthObject = {
        startDay: 2,
        hMonth: 'Adar II/Nisan',
        hYear: '5779',
        hMonthHebrew: 'אדר ב׳/ניסן',
        hYearHebrew: 'התשע״ט',
        hArray: hArray
    }
    return monthObject
}

// DATELIB.JS

// TIME OBJECT:  Used to represent time durations, intervals, and offsets

// Time constructor
function Time(week, day, hour, part) {
    this.week = week
    this.day = day
    this.hour = hour
    this.part = part

    // Times method (scalar multiplication)
    this.times = function (multiplier) {
        var product = new Time(multiplier * this.week, multiplier * this.day,
            multiplier * this.hour, multiplier * this.part)
        product.hour += Math.floor(product.part / 1080)
        product.part %= 1080
        product.day += Math.floor(product.hour / 24)
        product.hour %= 24
        product.week += Math.floor(product.day / 7)
        product.day %= 7
        return product
    }

    // toString method (output value as string)
    this.toString = function () {
        var string = this.week.toString() +
            (this.week === 1 ? ' week,' : ' weeks,')
        string += ' ' + this.day.toString() + (this.day === 1 ? ' day,' : ' days,')
        string += ' ' + this.hour.toString() +
            (this.hour === 1 ? ' hour,' : ' hours,')
        string += ' ' + this.part.toString() +
            (this.part === 1 ? ' part' : ' parts')
        return string
    }

    return
}                                // End definition of Time object

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

    // Plus method (compute and return UTC date plus Time offset)
    this.plus = function (offset) {
        var jsTime = this.utcTime.getTime()  // Milliseconds since UNIX epoch
        var msOffset = 10000 * (1080 * (24 * (7 * offset.week + offset.day) +
            offset.hour) + offset.part) / 3    // Offset in milliseconds
        // Add one second to mitigate against rounding errors, which truncate below
        //  (by rounding down to integral part = 1/18 minute = 10/3 seconds)
        var utcTime = new Date(Math.floor(jsTime + msOffset + 1000))
        var part = Math.floor(utcTime.getUTCSeconds() / (10 / 3))
        return new utcDate(
            utcTime.getUTCFullYear(), utcTime.getUTCMonth() + 1,
            utcTime.getUTCDate(), utcTime.getUTCHours(),
            utcTime.getUTCMinutes(), part)
    }

    // Minus method (compute and return UTC date minus Time offset)
    this.minus = function (offset) {
        var jsTime = this.utcTime.getTime()  // Milliseconds since UNIX epoch
        var msOffset = 10000 * (1080 * (24 * (7 * offset.week + offset.day) +
            offset.hour) + offset.part) / 3    // Offset in milliseconds
        // Add one second to mitigate against rounding errors, which truncate below
        //   (by rounding down to integral part = 1/18 minute = 10/3 seconds)
        var utcTime = new Date(Math.floor(jsTime - msOffset + 1000))
        var part = Math.floor(utcTime.getUTCSeconds() / (10 / 3))
        return new utcDate(
            utcTime.getUTCFullYear(), utcTime.getUTCMonth() + 1,
            utcTime.getUTCDate(), utcTime.getUTCHours(),
            utcTime.getUTCMinutes(), part)
    }

    // toString method (output value as string)
    this.toString = function () {
        var string = Math.floor(this.hour / 10).toString() +
            (this.hour % 10).toString() + ':' +
            Math.floor(this.minute / 10).toString() +
            (this.minute % 10).toString() + ' '
        if (this.part !== 0) string += this.part.toString() + '/18 '
        switch (this.dayOfWeek) {
            case 1: string += 'Sunday, '
                break
            case 2: string += 'Monday, '
                break
            case 3: string += 'Tuesday, '
                break
            case 4: string += 'Wednesday, '
                break
            case 5: string += 'Thursday, '
                break
            case 6: string += 'Friday, '
                break
            case 7: string += 'Saturday, '
        }
        string += this.day.toString() + ' '
        switch (this.month) {
            case 1: string += 'January '
                break
            case 2: string += 'February '
                break
            case 3: string += 'March '
                break
            case 4: string += 'April '
                break
            case 5: string += 'May '
                break
            case 6: string += 'June '
                break
            case 7: string += 'July '
                break
            case 8: string += 'August '
                break
            case 9: string += 'September '
                break
            case 10: string += 'October '
                break
            case 11: string += 'November '
                break
            case 12: string += 'December '
        }
        string += this.year.toString() + ' (UTC)'
        return string
    }

    return
}                                // End definition of utcDate object

// UTILITY FUNCTIONS

// isLeapYear(year):  Return true if (Hebrew) year be leap year, false otherw.
function isLeapYear(year) {
    var remainder = (7 * year + 1) % 19
    return remainder < 7
}

// Define fundamental intervals

var synodicMonth = new Time(0, 29, 12, 793)
console.log(`synodicMonth = ${synodicMonth.toString()}`)

var metonicCycle = synodicMonth.times(235)
console.log(`metonicCycle = ${metonicCycle.toString()}`)

var commonYear = synodicMonth.times(12)
console.log(`commonYear = ${commonYear.toString()}`)

var leapYear = synodicMonth.times(13)
console.log(`leapYear = ${leapYear.toString()}`)

// Set our reference spring molad

var moladSpring5779 = new utcDate(2019, 4, 5, 17, 50, 5)
console.log(`moladSpring5779 = ${moladSpring5779.toString()}`)

// Test our molad calculation code

var moladSpring = moladSpring5779
console.log('Going backwards:')
for (year = 5778; year >= 5774; --year) {
    if (isLeapYear(year + 1)) moladSpring = moladSpring.minus(leapYear)
    else moladSpring = moladSpring.minus(commonYear)
    console.log(`moladSpring${year} = ${moladSpring}`)
}

var moladSpring = moladSpring5779
console.log('Going forwards:')
for (year = 5780; year <= 5792; ++year) {
    if (isLeapYear(year)) moladSpring = moladSpring.plus(leapYear)
    else moladSpring = moladSpring.plus(commonYear)
    console.log(`moladSpring${year} = ${moladSpring}`)
}