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
        $moon = $('#moon'),
        $moonRiseIndicator = $('#moonRiseIndicator'),
        $moonSetIndicator = $('#moonSetIndicator'),
        $sun = $('#sun'),
        $sunRiseIndicator = $('#sunRiseIndicator'),
        $sunSetIndicator = $('#sunSetIndicator'),
        date = Date.now(),
        deg,
        LatAndLng = {                                                       // To be replaced with geo location service.
            lat: 29.4980603,
            lng: -98.6093386
        },
        moonRise = SunCalc.getMoonTimes(date, LatAndLng.lat, LatAndLng.lng).rise,
        moonSet = SunCalc.getMoonTimes(date, LatAndLng.lat, LatAndLng.lng).set,
        moon = new SkyObject('moon', $moon, moonRise, moonSet),
        number,
        numbers = document.getElementById('numbers'),
        radius = 348,
        sunRise =  SunCalc.getTimes(date, LatAndLng.lat, LatAndLng.lng).sunrise,
        sunSet =  SunCalc.getTimes(date, LatAndLng.lat, LatAndLng.lng).sunset,
        sun = new SkyObject('sun', $hour_ind, sunRise, sunSet),
        outerRadius = radius + 50,
        rotation,
        secs = 0,
        ticks = document.getElementById('ticks');

    function SkyObject(name, $name, rise, set) {
        var riseDeg = 0;
        var setDeg = 0;
        this.name = name;
        this.$name = $name;
        this.rise = rise;
        this.set = set;
        this.riseDeg = riseDeg;           //***************** Need to make variable.css(function) for visible or color.
        this.setDeg = setDeg;
        this.visibility = function () {
            var that = this;
            that.update();
            if (deg >= this.riseDeg && deg <= this.setDeg) {
                $name.css('visibility', 'visible');
                window.setInterval(function () {
                    that.update();
                }, 1000);
            } else if ((this.riseDeg > this.setDeg) && (deg > (this.riseDeg && this.setDeg))) {
                $name.css('visibility', 'visible');
                window.setInterval(function () {
                    that.update();
                }, 1000);
            }
            else {
                $name.css('visibility', 'hidden');
                window.clearInterval(this.update());
            }
        };
        this.update = function () {
            deg = secondsToDegrees(secs);
            setIndicator(deg, $name);
        };
    }

    startClock();

    function startClock() {
        date = Date.now();
        placeNumbers();
        createMarks();
        updateSecs();
        setSkyObject(sun.rise, sun.set, $sunRiseIndicator, $sunSetIndicator);
        setSkyObject(moon.rise, moon.set, $moonRiseIndicator, $moonSetIndicator);
        setAOS();
    }

    function setSkyObject(rise, set, $riseIndicator, $setIndicator) {
        extractSeconds(rise, $riseIndicator);
        extractSeconds(set, $setIndicator);
    }

    function extractSeconds(riseOrSetTime, $indicator) {
        var riseOrSetDeg = secondsToDegrees(stringToSeconds(riseOrSetTime));
        setIndicator(riseOrSetDeg, $indicator);
        setSkyObjectDeg(riseOrSetDeg, $indicator);
    }

    function stringToSeconds(grabTime) {             // Comes as an object with one long string value. Need split it up.
        var stringDateAndTime =  grabTime.toString();
        var arrayOfVariousData = stringDateAndTime.split(" ");
        var hourMin = arrayOfVariousData[4];                                       // Grabbing the time XX:xx:xx format.
        var separateHoursMin = hourMin.split(":");                            // Splitting time apart. I am a Time Lord!
        var sepHours = separateHoursMin[0];
        var sepMin = separateHoursMin[1];
        return  (60 * (sepMin) + (60 * (60 * sepHours)));
    }

    function secondsToDegrees(secs) {
        deg = secs * 0.00416666666;              // 0.00416666666 (yes, theoretical) is the second arc when 360 = 1 day.
        return deg;
    }

    function setIndicator(deg, $indicateType) {                      // ???? Can set parameters with defaults? Not here.
        $indicateType.css('transform','rotate(' + deg + 'deg)');
    }

    function setSkyObjectDeg(riseOrSetDeg, $indicator) {
        if ($indicator == $sunRiseIndicator) {sun.riseDeg = riseOrSetDeg;}
        else if ($indicator == $sunSetIndicator) {sun.setDeg = riseOrSetDeg;}
        else if ($indicator == $moonRiseIndicator) {moon.riseDeg = riseOrSetDeg;}
        else {moon.setDeg = riseOrSetDeg;}
    }

    function setAOS() {
        document.getElementById("area-of-sky")
            .setAttribute("d", describeArc(400, 400, 190, sun.riseDeg, sun.setDeg));
    }

    function handleEquinox() {
        if (180 == sun.setDeg - sun.riseDeg) {
            // placeMark(equinoxLine, ?outerRadius, ?length, ?rotation);
        }
    }

    function updateSecs() {
        var dt = new Date();
        secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
        return secs;
    }

    function updateHourInd() {
        secs += 1;
        deg = secondsToDegrees(secs);
        (secs >= 86400) ? startClock() : setIndicator(deg, $hour_ind);                         // This is going to cause
    }                                                                                      //problems when time changes.

    setInterval(updateHourInd, 1000);
    setInterval(moon.visibility(), 60000);

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
}());