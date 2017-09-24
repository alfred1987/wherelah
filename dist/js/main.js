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

	var AccountKey 	= 'C5kfbXNQOv6r8ptLY5tZsQ=='
		,busStopURL = 'http://datamall2.mytransport.sg/ltaodataservice/BusRoutes';




	$.ajax({
        url: busStopURL,
        type: 'GET',
        dataType: 'json',
        headers: {
            'AccountKey': AccountKey
        },
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
           	console.log('result: ' + result);
        },
        error: function (error) {
        	console.log('error: ' + error);   
        }
    });




});