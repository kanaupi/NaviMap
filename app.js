// set map options

var mylatlng = { lat:36.1091, lng:140.1014};
var mapOptions = {
    center:mylatlng,
    zoom:7,
    mapTypeId : google.maps.MapTypeId.ROADMAP
};

// create autocomplete object for all input
var options = {
    types: ['(cities)']
}
var input1 = document.getElementById("from");
var autocomplete1=new google.maps.places.Autocomplete(input1,options)

var input2 = document.getElementById("to");
var autocomplete2=new google.maps.places.Autocomplete(input2,options)

//wayPointsの宣言
var wayPoints =new Array();

//create map

var map=new google.maps.Map(document.getElementById("googleMap"), mapOptions)

//create a Directions service object to use the route method and get a result for our request

var directionsService=new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route

var directionsDisplay=new google.maps.DirectionsRenderer();

//bind the directionsRenderer to the map

directionsDisplay.setMap(map);

// function
var i=1;
function addVia(){
    if(i<8){
        //input
        var input_data = document.createElement('input');
        input_data.type = 'text';
        input_data.id = 'inputform_' + i;
        input_data.placeholder = 'via-' + i;
        var parent = document.getElementById('via-group');
        parent.appendChild(input_data);
        new google.maps.places.Autocomplete(document.getElementById('inputform_' + i),options);

        //削除ボタン
        var button_data = document.createElement('button');
        button_data.id = i;
        button_data.onclick = function(){return delVia(this);}
        button_data.innerHTML = '削除';
        var input_area = document.getElementById(input_data.id);
        parent.appendChild(button_data);

        var br_data=document.createElement('br');

        parent.appendChild(br_data);
        br_data.id = 'br_' + i;
        i++;
        return false;
    }
}

function delVia(target){
    if(i>1){
        var target_id = target.id;
        var parent = document.getElementById('via-group');
        var ipt_id = document.getElementById('inputform_' + target_id);
        var tgt_id = document.getElementById(target_id);
        var br_id = document.getElementById('br_' + target_id);
        parent.removeChild(ipt_id);
        parent.removeChild(tgt_id);
        parent.removeChild(br_id);
        i--;
    }
}

function calcRoute() {
    wayPoints =new Array();
    for (var j=1;j<i;j++){
        wayPoints.push({location:document.getElementById("inputform_" + j).value});
    }
    //create request
    var request={
        origin:document.getElementById("from").value,
        destination:document.getElementById("to").value,
        waypoints:wayPoints,
        optimizeWaypoints:true,
        travelMode:google.maps.TravelMode.DRIVING,//WALKING ,BYCYCLING ,TRANSIT
        unitSystem:google.maps.UnitSystem.IMPERIAL
    }

    //Pass the request to the route method
    directionsService.route(request,(result,status)=>{
        if(status==google.maps.DirectionsStatus.OK){
            var legs = result.routes[0].legs;
			
			// 総距離と総時間の合計する
			var dis = 0;
			var sec = 0;
			$.each(legs, function(i, val) {
				sec += val.duration.value;
				dis += val.distance.value;
			});
            //get distance and time
            const output = document.querySelector('#output');
            output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";

            //display route 
            directionsDisplay.setDirections(result);
        }else{
            //delete route from map
            directionsDisplay.setDirections({ routes: []});

            //center map in japan
            map.setCenter(mylatlng);

            //show error message
            output.innerHTML="<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance. </div>";
        }
    });
}




