/**
 * Created by macbookair on 2/2/17.
 */
/****************  API object ***********/
// Api request for sunrise and sunset. (On start or midnight update)
// Insert marks for sunrise and sunset.
// Equinox and solstice colors (Eq and sol API?)

/****************  Other Ideas  *********/
// Separate sun indicator for DST offset. Also greys out under horizon.
// Moon symbol. Obviously changes for phases. Circles face to represent position.
// Month and day arc.
// Season indicator.
// Temp and weather icons.

(function  () {
    var $hour_ind = $("#hour-ind"),
        secs = 0,
        radius = 348,
        outerRadius = radius - 10,
        numbers = document.getElementById('numbers'),
        ticks = document.getElementById('ticks'),
        rotation,
        number,
        angle;

    updateSecs();

    function updateSecs() {
        var dt = new Date();
        secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
        secs += 70; // Something is off approximately this amount. Instead of finding it....
    }

    function setIndicator () {
        secs += 1;
        var indicator = secs * 0.00416666666; // 0.00416666666 (yes, theoretical) is the second arc when 360 = 1 day.
        $hour_ind.css('transform','rotate(' + indicator + 'deg)');
        if (secs == 86399){updateSecs()}
    }

    setInterval(setIndicator, 1000);

    function createElement(type) {
        return document.createElementNS("http://www.w3.org/2000/svg", type);
    }

    function createMark(group, outerRadius, length, rotation) {
        var mark = createElement('line');
        mark.setAttribute('x1', outerRadius - length);
        mark.setAttribute('x2', outerRadius);
        mark.setAttribute('y1', '0');
        mark.setAttribute('y2', '0');
        mark.setAttribute('transform', 'rotate(' + rotation + ')');
        group.appendChild(mark);
    }

    for (var i = 0; i < 24; i++) {
        number = createElement('text');
        angle = Math.PI / 12 * i;
        number.setAttribute('x', radius * Math.cos(angle));
        number.setAttribute('y', radius * Math.sin(angle));
        number.innerHTML = ((i + 18) % 24);
        numbers.appendChild(number);
        rotation = i * 15;
        createMark(ticks, outerRadius + 40, 20, rotation);

        for (j = 1; j < 12; j++) {
            if (j % 6 == 0){
                createMark(ticks, outerRadius + 40, 18, rotation + j * 3.75);
            } else if (j % 3 == 0) {
                createMark(ticks, outerRadius + 40, 12, rotation + j * 3.75);
            } else {
                createMark(ticks, outerRadius + 40, 8, rotation + j * 1.25);
            }
        }
    }
}());
