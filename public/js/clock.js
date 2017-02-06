/**
 * Created by macbookair on 2/2/17.
 */
/***************  Face object ************/
// insert an incremented number every 15 degrees. (Hour makers)
// insert a tick mark every 3.75 degrees. (Fifteen minute intervals)

/****************  API object ***********/
// Api request for sunrise and sunset. (On start or midnight update)
// Insert marks for sunrise and sunset.
// Equinox and solstice colors (Eq and sol API?)

/****************  Hand object **********/
// One hand to rule them all. That pulses to represent seconds.

/****************  Other Ideas  *********/
// Separate sun indicator for DST offset. Also greys out under horizon.
// Moon symbol. Obviously changes for phases. Circles face to represent position.
// Month and day arc.
// Season indicator.
// Temp and weather icons.

// Everything here replicated in an analog style.
// And by the way this is a 24 hour clock with midnight (0:00) at the bottom.
(function  () {
    var $hour_ind = $("#hour-ind"),
        secs = 0;

    updateSecs();

    function updateSecs() {
        var dt = new Date();
        secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
    }

    function setIndicator () {
        secs += 1;
        var indicator = secs * 0.00416666666; // 0.00416666666 (yes, theoretical) is the second arc when 360 = 1 day.
        $hour_ind.css('transform','rotate(' + indicator + 'deg)');
        if (secs == 86399){updateSecs()}
    }

    setInterval(setIndicator, 1000);

    var radius = 350;
    var outerRadius = radius - 10;
        var numbers = document.getElementById('numbers');
    var ticks = document.getElementById('ticks');
    var mark;
    var rotation;
    var number;
    var angle;
        function cE(type) {
        return document.createElementNS("http://www.w3.org/2000/svg", type);
    }

    function createMark(group, outerRadius, length, rotation) {
        var mark = cE('line');
        mark.setAttribute('x1', outerRadius - length);
        mark.setAttribute('x2', outerRadius);
        mark.setAttribute('y1', '0');
        mark.setAttribute('y2', '0');
        mark.setAttribute('transform', 'rotate(' + rotation + ')');
        group.appendChild(mark);
    }

    for (var i = 0; i < 24; i++) {
        number = cE('text');
        angle = Math.PI / 12 * i;
        number.setAttribute('x', radius * Math.cos(angle));
        number.setAttribute('y', radius * Math.sin(angle));
        number.innerHTML = ((i + 2) % 24);
        numbers.appendChild(number);
        rotation = i * 15;
        createMark(ticks, outerRadius, 16, rotation);

        for (j = 1; j < 12; j++) {
            createMark(ticks, outerRadius, 8, rotation + j * 6);
        }
    }

}());
