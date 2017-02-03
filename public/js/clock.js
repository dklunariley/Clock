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
var x = 0;

function setSecondHand () {
    x += 6;
    $("#hour-ind").css('transform','rotate(' + x + 'deg)');
    if (x == 360){x = 0}
}

setInterval(setSecondHand, 1000);

