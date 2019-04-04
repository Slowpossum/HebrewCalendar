function getMonth(month, year) {
    var monthObject = {
        startDay: 2,
        hMonth: 'Adar II/Nisan',
        hYear: '5779',
        hMonthHebrew: 'אדר ב׳/ניסן',
        hYearHebrew: 'התשע״ט',
        hArray: []
    }
    
    monthObject.hArray[1] = {
        hYear: 5779,
        hMonth: 'Adar I',
        hDay: 25,
        hYearHebrew: 'התשע״ט',
        hMonthHebrew: 'באדר ב׳',
        hDayHebrew: 'כ״ה'
    }
    monthObject.hArray[2] = {
        hYear: 5779,
        hMonth: 'Adar II',
        hDay: 26,
        hYearHebrew: 'התשע״ט',
        hMonthHebrew: 'באדר ב׳',
        hDayHebrew: 'כ״ו'
    }
    for (i = 3; i != 31; ++i) monthObject.hArray[i] = monthObject.hArray[2] 
    return monthObject
}

var month = "April";
var year = 2019;
var constructedMonth = getMonth(month, year);

console.log(constructedMonth);
