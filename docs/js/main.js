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
		//console.log(response.value);
		
		$('.data > table').html('');

		$.each(response.value, function( index, value ) {
		    
		  $('.data > table').append(
		  	'<tr><td>' + 'BusStopCode: ' + value.BusStopCode + '<br />RoadName: ' + value.RoadName + '<br />Description: ' + value.Description + '<br />Latitude: ' + value.Latitude + '<br />Longitude: ' + value.Longitude + '</td></tr>'
		  );


		});




	});

	function getAllBusStop(){
		$.ajax({
			url: "allBusStop.json",
			dataType: "json",
			success: function (data) {
				console.log(data);
			}
		});
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

	getLocation();
	//getAllBusStop();






});