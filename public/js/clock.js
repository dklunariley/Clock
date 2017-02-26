/**
 * Created by macbookair on 2/2/17.
 */
/****************  API object ***********/
// Equinox and solstice colors (Eq and sol API?)

/****************  Other Ideas  *********/
// Separate sun indicator for DST offset. Also greys out under horizon.
// Moon symbol. Obviously changes for phases. Circles face to represent position.
// Month and day arc.
// Season indicator?
// Temp and weather icons.



(function  () {

    var $hour_ind = $("#hour-ind"),
        $sunRiseIndicator = $('#sunRiseIndicator'),
        $sunSetIndicator = $('#sunSetIndicator'),
        $moon = $('#moon'),
        $moonRiseIndicator = $('#moonRiseIndicator'),
        $moonSetIndicator = $('#moonSetIndicator'),
        deg,
        moonRiseDeg,
        moonSetDeg,
        number,
        numbers = document.getElementById('numbers'),
        radius = 348,
        outerRadius = radius + 50,
        rotation,
        secs = 0,
        ticks = document.getElementById('ticks');

    testFunction();
    function testFunction()
    {
        var date = Date.now();
        var lat =  29.4980603;
        var lng =  -98.6093386;
        var times = SunCalc.getTimes(date, lat, lng);

        var sunriseDateAndTime = times.sunrise;
        var stringDateAndTime =  sunriseDateAndTime.toString();
        var arrayifyHoursAndMin = stringDateAndTime.split(" ");
        var hourAndMin = arrayifyHoursAndMin[4];
        var separatedHoursAndMin = hourAndMin.split(":");
        var sepHours = separatedHoursAndMin[0];
        var sepMin = separatedHoursAndMin[1];
        console.log(sepHours + " " + sepMin);
        var moonTimes = SunCalc.getMoonTimes(date, lat, lng);
        console.log("Moon times: " + moonTimes);

        // var days = staticData.locations[0].astronomy.objects[0].days[0];
        var sunRise = (60 * (sepMin) + (60 * (60 * sepHours)));
        // var sunSet = (60 * (days.events[6].min)) + (60 * (60 * (days.events[6].hour)));
        var riseDeg = secondsToDegrees(sunRise);
        // var setDeg = secondsToDegrees(sunSet);
        setIndicator(riseDeg, $sunRiseIndicator);
        setIndicator(setDeg, $sunSetIndicator);
        document.getElementById("area-of-sky").setAttribute("d", describeArc(400, 400, 190, riseDeg, setDeg));
        var moonRise  = (60 * 8) + (60 * (60 * 22));
        var moonSet = (60 * 6) + (60 * (60 * 10));
        moonRiseDeg = secondsToDegrees(moonRise);
        moonSetDeg = secondsToDegrees(moonSet);
        console.log(moonRiseDeg + ' ' + moonSetDeg);
        setIndicator(moonRiseDeg, $moonRiseIndicator);
        setIndicator(moonSetDeg, $moonSetIndicator);

        // });
    }


    placeNumbers();
    createMarks();
    updateSecs();

    function updateSecs() {
        var dt = new Date();
        secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
        // secs += 70;                              // Something is off approximately this amount. Instead of finding it...
        return secs;
    }

    function secondsToDegrees(secs) {
        deg = secs * 0.00416666666;              // 0.00416666666 (yes, theoretical) is the second arc when 360 = 1 day.
        return deg;
    }

    function setIndicator(deg, $indicateType) {                      // ???? Can set parameters with defaults? Not here.
        $indicateType.css('transform','rotate(' + deg + 'deg)');
    }

    function updateHourInd() {
        secs += 1;
        deg = secondsToDegrees(secs);
        (secs == 86400) ? updateSecs() : setIndicator(deg, $hour_ind);
        if (deg >= moonRiseDeg || deg <= moonSetDeg) {     // If set is < than rise! Need 'if' for when rise < than set.
            console.log("Deg: " + deg +" moonRiseDeg: " + moonRiseDeg + " moonSetDeg: " + moonSetDeg);
            $moon.css('visibility', 'visible');
            setInterval(updateMoon, 1000);
        } else {
            $moon.css('visibility', 'hidden');
            clearInterval(updateMoon);
        }
    }

    setInterval(updateHourInd, 1000);

    function updateMoon() {
        deg = secondsToDegrees(secs);
        setIndicator(deg, $moon);
    }

    function createElement(type) {
        return document.createElementNS("http://www.w3.org/2000/svg", type);
    }

    function createMarks() {
        for (var i = 0; i < 24; i++) {
            rotation = i * 15;
            placeMark(ticks, outerRadius, 20, rotation);
            for (var j = 1; j < 12; j++) {
                if (j % 6 == 0) {
                    placeMark(ticks, outerRadius, 18, rotation + j * 3.75);
                } else if (j % 3 == 0) {
                    placeMark(ticks, outerRadius, 12, rotation + j * 3.75);
                } else {
                    placeMark(ticks, outerRadius, 8, rotation + j * 1.25);
                }
            }
        }
    }

    function placeMark(group, outerRadius, length, rotation) {
        var mark = createElement('line');
        mark.setAttribute('x1', outerRadius - length);
        mark.setAttribute('x2', outerRadius);
        mark.setAttribute('y1', '0');
        mark.setAttribute('y2', '0');
        mark.setAttribute('transform', 'rotate(' + rotation + ')');
        group.appendChild(mark);
    }

    function placeNumbers() {
        for (var i = 0; i < 24; i++) {
            number = createElement('text');
            rotation = i * 15;                          // Using rotation as angle since it has the same value (always).
            var set = polarToCartesian(0, 0, radius, rotation);
            number.setAttribute('x', set.x);
            number.setAttribute('y', set.y);
            number.innerHTML = ((i + 18) % 24);
            numbers.appendChild(number);
        }
    }

    function describeArc(x, y, radius, startAngle, endAngle){
        startAngle += 90; endAngle += 90;
        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);
        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return  [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    }

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }
}());