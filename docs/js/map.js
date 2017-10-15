if( $('.cd-stretchy-nav').length > 0 ) {
   var stretchyNavs = $('.cd-stretchy-nav');
   
   stretchyNavs.each(function(){
      var stretchyNav = $(this),
         stretchyNavTrigger = stretchyNav.find('.cd-nav-trigger');
      
      stretchyNavTrigger.on('click', function(event){
         event.preventDefault();
         stretchyNav.toggleClass('nav-is-visible');
      });
   });

   $(document).on('click', function(event){
      ( !$(event.target).is('.cd-nav-trigger') && !$(event.target).is('.cd-nav-trigger span') ) && stretchyNavs.removeClass('nav-is-visible');
   });
}

var dateFormat = function () {
   var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
   timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
   timezoneClip = /[^-+\dA-Z]/g,
   pad = function (val, len) {
       val = String(val);
       len = len || 2;
       while (val.length < len) val = "0" + val;
       return val;
   };

   // Regexes and supporting functions are cached through closure
   return function (date, mask, utc) {
   var dF = dateFormat;

   // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
   if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
       mask = date;
       date = undefined;
   }

   // Passing date through Date applies Date.parse, if necessary
   date = date ? new Date(date) : new Date;

   if (isNaN(date)) throw SyntaxError("invalid date");

   mask = String(dF.masks[mask] || mask || dF.masks["default"]);

   // Allow setting the utc argument via the mask
   if (mask.slice(0, 4) == "UTC:") {
       mask = mask.slice(4);
       utc = true;
   }

   var _ = utc ? "getUTC" : "get",
       d = date[_ + "Date"](),
       D = date[_ + "Day"](),
       m = date[_ + "Month"](),
       y = date[_ + "FullYear"](),
       H = date[_ + "Hours"](),
       M = date[_ + "Minutes"](),
       s = date[_ + "Seconds"](),
       L = date[_ + "Milliseconds"](),
       o = utc ? 0 : date.getTimezoneOffset(),
       flags = {
           d:    d,
           dd:   pad(d),
           ddd:  dF.i18n.dayNames[D],
           dddd: dF.i18n.dayNames[D + 7],
           m:    m + 1,
           mm:   pad(m + 1),
           mmm:  dF.i18n.monthNames[m],
           mmmm: dF.i18n.monthNames[m + 12],
           yy:   String(y).slice(2),
           yyyy: y,
           h:    H % 12 || 12,
           hh:   pad(H % 12 || 12),
           H:    H,
           HH:   pad(H),
           M:    M,
           MM:   pad(M),
           s:    s,
           ss:   pad(s),
           l:    pad(L, 3),
           L:    pad(L > 99 ? Math.round(L / 10) : L),
           t:    H < 12 ? "a"  : "p",
           tt:   H < 12 ? "am" : "pm",
           T:    H < 12 ? "A"  : "P",
           TT:   H < 12 ? "AM" : "PM",
           Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
           o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
           S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
       };

   return mask.replace(token, function ($0) {
       return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
   });
};
}();

// Some common format strings
dateFormat.masks = {
   "default":      "ddd mmm dd yyyy HH:MM:ss",
   shortDate:      "m/d/yy",
   mediumDate:     "mmm d, yyyy",
   longDate:       "mmmm d, yyyy",
   fullDate:       "dddd, mmmm d, yyyy",
   shortTime:      "h:MM TT",
   mediumTime:     "h:MM:ss TT",
   longTime:       "h:MM:ss TT Z",
   isoDate:        "yyyy-mm-dd",
   isoTime:        "HH:MM:ss",
   isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
   isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
   dayNames: [
      "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
   ],
   monthNames: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
   ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
   return dateFormat(this, mask, utc);
};

var allBusStop      = []
   ,nearestBusStop  = []
   ,busArrival      = []
   ,origin          = []
   ,proxy           = 'https://cors-anywhere.herokuapp.com/';

function getNearestBusStop(allBusStop) {

  var array = []
      ,BusStopCode = []
      ,Distance = []
      ,RoadName = []
      ,Description = [];

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  function success(pos) {
    var crd = pos.coords;
    origin = {"Longitude":crd.longitude,"Latitude":crd.latitude};
    //origin = {"Longitude":103.9438054,"Latitude":1.3188777000000003};
    console.log(origin);

    for (var index in allBusStop) {     
      var busStopCode = allBusStop[index].BusStopCode;
      var databaseBusStop = {"Longitude": allBusStop[index].Longitude,"Latitude":allBusStop[index].Latitude};
      var distance = calculateDistance(origin, databaseBusStop)
      array.push({
        BusStopCode: busStopCode,
        Distance: distance,
        RoadName: allBusStop[index].RoadName,
        Description: allBusStop[index].Description,
      });
    }

    function calculateDistance(p1, p2) {
       var erdRadius = 6371;

       var p1Longitude = p1.Longitude * (Math.PI / 180);
       var p1Latitude = p1.Latitude * (Math.PI / 180);
       var p2Longitude = p2.Longitude * (Math.PI / 180);
       var p2Latitude = p2.Latitude * (Math.PI / 180);

       var x0 = p1Longitude * erdRadius * Math.cos(p1Latitude);
       var y0 = p1Latitude * erdRadius;

       var x1 = p2Longitude * erdRadius * Math.cos(p2Latitude);
       var y1 = p2Latitude * erdRadius;

       var dx = x0 - x1;
       var dy = y0 - y1;

       return Math.sqrt((dx * dx) + (dy * dy));
    }

    array.sort(function (a, b) {
       return a.Distance - b.Distance;
    });

    for (var i = 0; i < 20; i++){
      //collect bus stop number within 0.3 meter
      if( array[i].Distance >= 0.3 || i>5 ){
         break;
      }

      nearestBusStop.push(array[i]);
    };

    $('.data').html('');

    var mapOptions = {
      center: new google.maps.LatLng(1.3188,103.94),
      zoom: 15,
      mapTypeId: 'roadmap',
    };

    var map         = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var infoWindow  = new google.maps.InfoWindow();
    var bounds      = new google.maps.LatLngBounds();

     $.each(nearestBusStop, function( index, value ) {    

        var settings = {
           "async": true,
           "crossDomain": true,
           "url": proxy + "http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=" + value.BusStopCode,
           "method": "GET",
           "headers": {
              "accountkey": "0TAM+9H4RM6aH0P6Dg9jnA==",
              "accept": "application/json",
              "cache-control": "no-cache"
           }
        }

        $.ajax(settings).done(function (response) {

           $('.data').append('<table class="stop-' + response.BusStopCode + '" cellspacing="0" cellspacing="0" border="0" align="center"><tr><td>Bus Stop: ' + response.BusStopCode + '<br />Road name: ' + value.RoadName + '<br />Description: ' + value.Description + '</td></tr><tr><td class="estimate"></td></tr></table>');

           
           $.each(response.Services, function( i, v ) {

              if( (v.NextBus.Latitude == 0) && (v.NextBus.Longitude == 0) ) {
                //...
              } else {

                var latlng    = new google.maps.LatLng(v.NextBus.Latitude, v.NextBus.Longitude);
                
                var image = {
                  url: 'img/bus20.png',
                  size: new google.maps.Size(20, 20)
                };

                var marker    = new google.maps.Marker({
                    map       : map,
                    position  : latlng,
                    title     : v.ServiceNo,
                    icon      : image
                 });

                google.maps.event.addListener(marker, 'click', function() {
                  // Creating the content to be inserted in the infowindow
                  /*
                  var iwContent = '<div id="iw_container">' +
                        '<div class="iw_title">Bus no: ' + v.ServiceNo + '</div>' +
                     '<div class="iw_content">Lat: ' +  v.NextBus.Latitude + ', Lng: ' + v.NextBus.Longitude + '</div></div>';
                  */
                  
                  var iwContent = '<div id="iw_container"><div class="iw_title">' + v.ServiceNo + '</div></div>';

                  // including content to the Info Window.
                  infoWindow.setContent(iwContent);

                  // opening the Info Window in the current map and at the current marker location.
                  infoWindow.open(map, marker);
                 });

              }

              $('.stop-' + response.BusStopCode + ' .estimate' ).append('<table cellspacing="0" cellpadding="0" border="0" align="center"><tr><td>Bus No: ' + v.ServiceNo + ' is coming in ' + timeToMinute(v.NextBus.EstimatedArrival) + ' mins</td></tr></table>');
           });
        });
     });
  };

  function error(err) {
    alert('ERROR(' + err.code + '): ' + err.message);
  };

  navigator.geolocation.getCurrentPosition(success, error, options);  
}

function timeToMinute(arriveTime) {
   var convertArriveTime = new Date(arriveTime);
   var millis =  convertArriveTime- $.now() ;   
   var minutes = Math.floor(millis / 60000);
   return ((minutes < 0) ? 0 : minutes);;
}

$.ajax({
   url: "allBusStop.json",
   dataType: "json",
   success: function (data) {
      console.log('sucess');
      getNearestBusStop(data.value);
   }
});