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
        date = Date.now(),
        deg,
        LatAndLng = {
            lat: 29.4980603,
            lng: -98.6093386
        },
        Moon = {
            rise : SunCalc.getMoonTimes(date, LatAndLng.lat, LatAndLng.lng).rise,
            set : SunCalc.getMoonTimes(date, LatAndLng.lat, LatAndLng.lng).set,
            moonRiseDeg : 0,
            moonSetDeg : 0
        },
        number,
        numbers = document.getElementById('numbers'),
        radius = 348,
        Sun = {
            rise :  SunCalc.getTimes(date, LatAndLng.lat, LatAndLng.lng).sunrise,
            set :  SunCalc.getTimes(date, LatAndLng.lat, LatAndLng.lng).sunset,
            sunRiseDeg : 0,
            sunSetDeg : 0
        },
        outerRadius = radius + 50,
        rotation,
        secs = 0,
        ticks = document.getElementById('ticks');

    placeNumbers();
    createMarks();
    updateSecs();
    setSkyObject(Sun.rise, Sun.set, $sunRiseIndicator, $sunSetIndicator);
    setSkyObject(Moon.rise, Moon.set, $moonRiseIndicator, $moonSetIndicator);
    setAOS();

    function setSkyObject(rise, set, $riseIndicator, $setIndicator) {
        extractSeconds(rise, $riseIndicator);
        extractSeconds(set, $setIndicator);
    }

    // function getMoonPhase(date) {
    //     var moonPhase = SunCalc.getMoonIllumination(date);
    //     // console.log(moonPhase);
    // }

    function extractSeconds(riseOrSetTime, $indicator) {
        var riseOrSetDeg = secondsToDegrees(pullHourAndMin(riseOrSetTime));
        setIndicator(riseOrSetDeg, $indicator);
        if ($indicator == $sunRiseIndicator) {Sun.sunRiseDeg = riseOrSetDeg;}
            else if ($indicator == $sunSetIndicator) {Sun.sunSetDeg = riseOrSetDeg;}
            else if ($indicator == $moonRiseIndicator) {Moon.moonRiseDeg = riseOrSetDeg;}
            else {Moon.moonSetDeg = riseOrSetDeg;}
    }

    function setAOS() {
        document.getElementById("area-of-sky").setAttribute("d", describeArc(400, 400, 190, Sun.sunRiseDeg, Sun.sunSetDeg));
    }

    function updateSecs() {
        var dt = new Date();
        secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
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
        if (deg >= Moon.moonRiseDeg && deg <= Moon.moonSetDeg) {     // If set is < than rise! Need 'if' for when rise < than set.
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
        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";        // Will be obtuse when past spring solstice.
        return  [                                                                     //  Acute when past fall solstice.
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

    function pullHourAndMin(grabTime) {             // Comes as an object with one long string value. Need split it up.
        var stringDateAndTime =  grabTime.toString();
        var arrayOfHoursAndMin = stringDateAndTime.split(" ");
        var hourAndMin = arrayOfHoursAndMin[4];                                   // Grabbing the time XX:xx:xx format.
        var separatedHoursAndMin = hourAndMin.split(":");                                       // Splitting time apart.
        var sepHours = separatedHoursAndMin[0];
        var sepMin = separatedHoursAndMin[1];
        return  (60 * (sepMin) + (60 * (60 * sepHours)));
    }
}());