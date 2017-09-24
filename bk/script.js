var proxy = 'https://cors-anywhere.herokuapp.com/';
var allBusStop = [];
var nearestBusStop = [];
var busArrival = [];
var origin={};
	
$( document ).ready(function() {
	
	// TOGGLE COMMENT HERE FOR ACTUAL CODE	
	// main();
	displayHTMLContent();
	// TOGGLE COMMENT HERE FOR ACTUAL CODE
		
	$('#collectApi').click(function() {
	
	
	// TOGGLE COMMENT HERE FOR ACTUAL CODE
	// allBusStop = [];
	// nearestBusStop = [];
	// busArrival = [];
	// origin={};	
	// main();
	displayHTMLContent();
	// TOGGLE COMMENT HERE FOR ACTUAL CODE
	
	
	 
	
	
	});
});


function main(){
console.log("S1-button pressed");
getGeolocation();
console.log("????");
}

function main2(){
console.log("S3-getting all bus stop info");
// get all bus stop geolocation from json	
getAllBusStop(function(){
	//find nearest bus location based on calculation 
	getNearestBusStop(allBusStop);
	//only pass the nearest bus stop to get arrival time
	getBusArrival(nearestBusStop[0].BusStopCode,function(){
		// code after receive arrival time
		displayHTMLContent();




	});
});

}


function getAllBusStop(callback){
		
$.ajax({

url: "db/allBusStop.json",
dataType: "json",
success: function (data) {
allBusStop = data.value;
callback(

);
}

});
	
}


function getNearestBusStop(allBusStop){
	
	// origin = {"Longitude":103.748086,"Latitude":1.403530};

    var array = [];
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
	//collect bus stop number within 0.3meter
	if(array[i].Distance >= 0.3 || i>5){break;}

	nearestBusStop.push(array[i]);
	
};
	return nearestBusStop
}


function getBusArrival(busStopCode,callback){

var api = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2';
var url = proxy + api + "?BusStopCode=" + busStopCode;
var param = {
	"method": "GET",
	"headers": {
	"accountkey": "lFMe6RV9SceFo50NVEE5Yw==",
	"accept": "application/json",
	}
};

	
fetch(url,param)
.then((data) => data.json())
.then(function(data){
	busArrival = data.Services;
	console.log(busArrival);
	callback();
});


};


function getGeolocation(){

	var options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
	};

	function success(pos) {
	var crd = pos.coords;
	console.log('Your current position is:');
	console.log(`Latitude : ${crd.latitude}`);
	console.log(`Longitude: ${crd.longitude}`);
	origin = {"Longitude":crd.longitude,"Latitude":crd.latitude};
	console.log("S2-geolocation received");
	main2();
	};

	function error(err) {
	console.warn(`ERROR(${err.code}): ${err.message}`);
	$("#content").text("ERR-geolocation not received");
	};

	navigator.geolocation.getCurrentPosition(success, error, options);
	
	
};


function displayHTMLContent(){
	
	// TOGGLE COMMENT HERE FOR ACTUAL CODE
	nearestBusStop = '[{"BusStopCode":"00481","RoadName":"Woodlands Rd","Description":"BT PANJANG TEMP BUS PK","Latitude":1.383764,"Longitude":103.7583},{"BusStopCode":"01012","RoadName":"Victoria St","Description":"Hotel Grand Pacific","Latitude":1.29684825487647,"Longitude":103.85253591654006}]';
	nearestBusStop = JSON.parse(nearestBusStop);
	busArrival = '[{"ServiceNo":"302","Operator":"SMRT","NextBus":{"OriginCode":"44009","DestinationCode":"44009","EstimatedArrival":"2017-09-18T16:10:53+08:00","Latitude":"1.4027476666666667","Longitude":"103.74601733333333","VisitNumber":"1","Load":"SDA","Feature":"WAB","Type":"BD"},"NextBus2":{"OriginCode":"44009","DestinationCode":"44009","EstimatedArrival":"2017-09-18T16:11:04+08:00","Latitude":"1.4028731666666667","Longitude":"103.7461315","VisitNumber":"1","Load":"SDA","Feature":"WAB","Type":"SD"},"NextBus3":{"OriginCode":"44009","DestinationCode":"44009","EstimatedArrival":"2017-09-18T16:17:09+08:00","Latitude":"1.3963331666666667","Longitude":"103.7455245","VisitNumber":"1","Load":"SEA","Feature":"","Type":"BD"}},{"ServiceNo":"979","Operator":"SMRT","NextBus":{"OriginCode":"45009","DestinationCode":"45009","EstimatedArrival":"2017-09-18T16:16:35+08:00","Latitude":"1.3972933333333333","Longitude":"103.74760016666667","VisitNumber":"1","Load":"SEA","Feature":"WAB","Type":"DD"},"NextBus2":{"OriginCode":"45009","DestinationCode":"45009","EstimatedArrival":"2017-09-18T16:30:58+08:00","Latitude":"1.3805995","Longitude":"103.7605295","VisitNumber":"1","Load":"SDA","Feature":"WAB","Type":"SD"},"NextBus3":{"OriginCode":"45009","DestinationCode":"45009","EstimatedArrival":"2017-09-18T16:33:26+08:00","Latitude":"0","Longitude":"0","VisitNumber":"1","Load":"SEA","Feature":"WAB","Type":"DD"}}]';
	busArrival = JSON.parse(busArrival);
	// TOGGLE COMMENT HERE FOR ACTUAL CODE
	
// 	var regex = /T(.{8})/;
// 	var match;
	
	// reassign the array 
	var busArrivalForDisplay = {};
	for (index in busArrival){
		busArrivalForDisplay[index] = {
			"ServiceNo":busArrival[index].ServiceNo,
			"NextBus":busArrival[index].NextBus,
			"NextBus":[busArrival[index].NextBus,busArrival[index].NextBus2,busArrival[index].NextBus3]
		};
	};
	
	
	// filling into HTML
	$("#content").text("");
	$("#content").append('Latitide: '+origin.Latitude + '<br>');
	$("#content").append('Longitude: '+origin.Longitude + '<br>');
	$("#content").append('Bus Stop: '+nearestBusStop[0].BusStopCode + '<br>');
	$("#content").append('Road: '+nearestBusStop[0].RoadName + '<br>');
	$("#content").append(nearestBusStop[0].Description + '<br>');
	for (i in busArrivalForDisplay){
	$("#content").append(busArrivalForDisplay[i].ServiceNo + '<br>');
			for (j in busArrivalForDisplay[i].NextBus){
// 				match="";
// 				match=regex.exec(busArrivalForDisplay[i].NextBus[j].EstimatedArrival);
				var arriveTime = busArrivalForDisplay[i].NextBus[j].EstimatedArrival;
				try{$("#content").append(timeToMinute(arriveTime) + ' min')}
				catch(e){$("#content").append("")}
				$("#content").append('<br>');
			};
	};


}


function timeToMinute(arriveTime) {
	var convertArriveTime = new Date(arriveTime);
	var millis =  convertArriveTime- $.now() ;	
  	var minutes = Math.floor(millis / 60000);
	
  	return ((minutes < 0) ? 0 : minutes);;
}


