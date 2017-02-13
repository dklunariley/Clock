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
    var staticData = {
        "version": 2,

        "locations": [{
            "id": "750",

            "geo": {
                "name": "Lord Howe Island",

                "state": "Lord Howe Island",

                "country": {
                    "id": "au",
                    "name": "Australia"
                },

                "latitude": -31.557,

                "longitude": 159.086
            },

            "astronomy": {
                "objects": [{
                    "name": "sun",

                    "current": {
                        "azimuth": 89.0,
                        "altitude": 28.0,
                        "distance": 147696384
                    },

                    "days": [{
                        "date": "2017-02-12",
                        "events": [{
                            "type": "antimeridian",
                            "hour": 0,
                            "min": 38
                        },
                            {
                                "type": "twi18_start",
                                "hour": 4,
                                "min": 31
                            },
                            {
                                "type": "twi12_start",
                                "hour": 5,
                                "min": 3
                            },
                            {
                                "type": "twi6_start",
                                "hour": 5,
                                "min": 34
                            },{
                                "type": "rise",
                                "hour": 7,
                                "min": 15,
                                "azimuth": 106.8
                            },{
                                "type": "meridian",
                                "hour": 12,
                                "min": 38,
                                "altitude": 72.1,
                                "distance": 147673000
                            },{
                                "type": "set",
                                "hour": 18,
                                "min": 22,
                                "azimuth": 253.5
                            },{
                                "type": "twi6_end",
                                "hour": 19,
                                "min": 42
                            },{
                                "type": "twi12_end",
                                "hour": 20,
                                "min": 12
                            },{
                                "type": "twi18_end",
                                "hour": 20,
                                "min": 43
                            }],
                        "daylength": "13:17",
                        "moonphase": "waninggibbous"
                    },{
                        "date": "2017-02-13",
                        "events": [{
                            "type": "antimeridian",
                            "hour": 0,
                            "min": 38
                        },{
                            "type": "twi18_start",
                            "hour": 4,
                            "min": 33
                        },{
                            "type": "twi12_start",
                            "hour": 5,
                            "min": 4
                        },{
                            "type": "twi6_start",
                            "hour": 5,
                            "min": 35
                        },{
                            "type": "rise",
                            "hour": 6,
                            "min": 0,
                            "azimuth": 106.4
                        },{
                            "type": "meridian",
                            "hour": 12,
                            "min": 38,
                            "altitude": 71.8,
                            "distance": 147701000
                        },{
                            "type": "set",
                            "hour": 19,
                            "min": 15,
                            "azimuth": 253.9
                        },{
                            "type": "twi6_end",
                            "hour": 19,
                            "min": 41
                        },{
                            "type": "twi12_end",
                            "hour": 20,
                            "min": 11
                        },{
                            "type": "twi18_end",
                            "hour": 20,
                            "min": 42
                        }],
                        "daylength": "13:15",
                        "moonphase": "waninggibbous"
                    }]
                }]
            }
        }]
    };

    var $hour_ind = $("#hour-ind"),
        secs = 0,
        radius = 348,
        outerRadius = radius - 10,
        numbers = document.getElementById('numbers'),
        ticks = document.getElementById('ticks'),
        rotation,
        number,
        angle,
        days,
        sunRiseHour,
        sunRiseMinute,
        sunRise,
        sunSetHour,
        sunSetMin,
        sunSet;


    
        // var $info = $.ajax('https://api.xmltime.com/astronomy?accesskey=Q2QvwUXkdG&expires=2017-02-13T00%3A55%3A54%2B00%3A00&signature=7W%2BD6kQ2SBrgumy88CTXeIvQnWg%3D&version=2&object=sun&placeid=australia%2Flord-howe-island&startdt=2017-02-12&types=all');

    testFunction();
    function testFunction()
    {
        var $sunSetIndicator = $('#sunSetIndicator');
        var $sunRiseIndicator = $('#sunRiseIndicator');
        // $info.done(function() {
        console.log("Received request");
        // info = $info.responseText;
        console.log(staticData);
        // var json = JSON.parse($info);
        days = staticData.locations[0].astronomy.objects[0].days[0];
        sunRiseHour = days.events[4].hour;
        sunRiseMinute = days.events[4].min;
        sunRise = (60 * sunRiseMinute) + (60 * (60 * sunRiseHour));
        sunSetHour = days.events[6].hour;
        sunSetMin = days.events[6].min;
        sunSet = (60 * sunSetMin) + (60 * (60 * sunSetHour));
        setIndicator(sunRise, $sunRiseIndicator);
        setIndicator(sunSet, $sunSetIndicator);
        console.log("Sun rise in milli secs: " + sunRise);
        console.log("Sun set in milli secs: " + sunSet);

        // });
    }

        // $info.fail(function () {
        //     console.log("Error");
        // });
        //
        // $info.always(function () {
        //     console.log("Complete");
        // });

    updateSecs();

    function updateSecs() {
        var dt = new Date();
        secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
        secs += 70; // Something is off approximately this amount. Instead of finding it....
    }

    function setIndicator (secs, $indicateType) {
        secs += 1;
        console.log(secs);
        var indicator = secs * 0.00416666666; // 0.00416666666 (yes, theoretical) is the second arc when 360 = 1 day.
        $indicateType.css('transform','rotate(' + indicator + 'deg)');
        if (secs == 86400){updateSecs();}
    }

    setInterval(setIndicator(secs, $hour_ind), 1000);

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
        number.setAttribute('x', ((radius - 10) * Math.cos(angle)));
        number.setAttribute('y', ((radius - 10) * Math.sin(angle)));
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


// test query for dateandtime.com
// https://api.xmltime.com/astronomy?accesskey=Q2QvwUXkdG&expires=2017-02-12T18%3A57%3A46%2B00%3A00&signature=fz6cny4zA05%2F7bp1vuspGYk54RY%3D&version=2&prettyprint=1&object=moon&placeid=australia%2Flord-howe-island&startdt=2017-02-12&enddt=2017-02-15&geo=0&types=all



}());