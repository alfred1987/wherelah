jQuery(document).ready(function(){
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

	console.log('Ready ...');

	var allBusStop = []
	,nearestBusStop = []
	,busArrival = []
	,origin = [];
	
	var proxy = 'https://cors-anywhere.herokuapp.com/';

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": proxy + "http://datamall2.mytransport.sg/ltaodataservice/BusStops",
		"method": "GET",
		"headers": {
			"accountkey": "0TAM+9H4RM6aH0P6Dg9jnA==",
			"accept": "application/json",
			"cache-control": "no-cache"
		}
	}

	$.ajax(settings).done(function (response) {		
		$('.data > table').html('');

		$.each(response.value, function( index, value ) {
		  $('.data > table').append(
		  	'<tr><td>' + 'BusStopCode: ' + value.BusStopCode + '<br />RoadName: ' + value.RoadName + '<br />Description: ' + value.Description + '<br />Latitude: ' + value.Latitude + '<br />Longitude: ' + value.Longitude + '</td></tr>'
		  );
		});
	});

	function getAllBusStop() {
		$.ajax({
			url: "allBusStop.json",
			dataType: "json",
			success: function (data) {
				allBusStop = data.value;
			}
		});
	}

	function getNearestBusStop(allBusStop) {
		var array = []
			,BusStopCode = []
			,Distance = []
			,RoadName = []
			,Description = [];

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

		console.log(array);
		
		/*
		for (var i = 0; i < 20; i++){
			//collect bus stop number within 0.3meter
			if(array[i].Distance >= 0.3 || i>5){break;}
			nearestBusStop.push(array[i]);
		};
		
		return nearestBusStop;
		*/
	}

	function getLocation() {
	    if (navigator.geolocation) {
	        navigator.geolocation.watchPosition(showPosition);
	    } else { 
	        x.innerHTML = "Geolocation is not supported by this browser.";
	    }
    }
    
	function showPosition(position) {
		console.log('lat: ' + position.coords.latitude);
		console.log('lng: ' + position.coords.longitude);
	}


	function displayHTMLContent() {
		var busArrivalForDisplay = [];
		for (index in busArrival){
			busArrivalForDisplay[index] = {
				"ServiceNo":busArrival[index].ServiceNo,
				"NextBus":busArrival[index].NextBus,
				"NextBus":[busArrival[index].NextBus,busArrival[index].NextBus2,busArrival[index].NextBus3]
			};
		};
		
		$("#content").text("");
		$("#content").append('Latitide: '+origin.Latitude + '<br>');
		$("#content").append('Longitude: '+origin.Longitude + '<br>');
		$("#content").append('Bus Stop: '+nearestBusStop[0].BusStopCode + '<br>');
		$("#content").append('Road: '+nearestBusStop[0].RoadName + '<br>');
		$("#content").append(nearestBusStop[0].Description + '<br>');

		for (i in busArrivalForDisplay){
			$("#content").append(busArrivalForDisplay[i].ServiceNo + '<br>');
			for (j in busArrivalForDisplay[i].NextBus){
				var arriveTime = busArrivalForDisplay[i].NextBus[j].EstimatedArrival;
				try {
				
					$("#content").append(timeToMinute(arriveTime) + ' min');
				
				} catch(e){ 
	
					$("#content").append("");
	
				}

				$("#content").append('<br>');
			}
		}
	}

	function timeToMinute(arriveTime) {
		var convertArriveTime = new Date(arriveTime);
		var millis =  convertArriveTime- $.now() ;	
	  	var minutes = Math.floor(millis / 60000);
	  	return ((minutes < 0) ? 0 : minutes);;
	}

	console.log(getNearestBusStop(allBusStop));
});