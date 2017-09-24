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
		console.log(response);
		$('.data').html(response);
	});











});