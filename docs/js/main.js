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

	var accountKey 	= 'C5kfbXNQOv6r8ptLY5tZsQ=='
		,busStopURL = 'https://datamall2.mytransport.sg/ltaodataservice/BusRoutes';



	/*
	$.ajax({
        url: busStopURL,
        type: 'GET',
        headers: {
            'AccountKey': accountKey,
            'accept' 	: "application/json",
        },
        success: function (result) {
           	console.log('result: ' + result);
        },
        error: function (error) {
        	console.log('error: ' + error);   
        }
    });
	*/


	var param = {
		"method": "GET",
		"headers": {
		"accountkey": accountKey,
		"accept": "application/json",
		}
	};

	fetch(busStopURL,param).then((data) => data.json()).then(function(data){ console.log(data); });



});