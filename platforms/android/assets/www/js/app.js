var interval = null;


if (window.cordova) {
  document.addEventListener('deviceready', startApp, false);
} else {
  startApp();
}

function startApp() {

	document.addEventListener('pause', onPause, false);
	document.addEventListener('resume', onResume, false);

	document.addEventListener('offline', onOffline, false);
	document.addEventListener('online', onOnline, false);

	show();


}

function show() {
	clearInterval(interval); // stop the interval
	const code = JSON.parse(localStorage.getItem('code'));
	if (!code) {
		$('#form').show();
		$('#info').hide();
	} else {
		$('#form').hide();
		$('#info').show();

		$('#firstname').text(code.firstname);
		$('#lastname').text(code.lastname);

		getPosition();
		interval = setInterval(getPosition,10000);
	}

}



function getPosition() {
   var options = {
      enableHighAccuracy: true,
      maximumAge: 3600000
   }
   var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

   function onSuccess(position) {
   	console.log(position.coords.latitude);
	// $('#logs').append('<div>'+ JSON.stringify(position.coords.latitude) +' '+ position.coords.longitude +'</div>');
	$('#Latitude').text(position.coords.latitude);
	$('#Longitude').text(position.coords.longitude);

		$.post( 'http://bleau.fr/gps1.php', { latitude: position.coords.latitude, longitude: position.coords.longitude })
		.done(function( data ) {
		    console.log('position sent');
		});

   };

   function onError(error) {
      console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
      $('#logs').append('<div>'+ error.code +'</div>');
   }
}


function onPause() {
	clearInterval(interval); // stop the interval
}

function onResume() {
	show();
}

function onOffline() {
	console.log('offline');
	$('#main').hide();
	$('#offline').show();
}

function onOnline() {
	console.log('online');
	$('#offline').hide();
	$('#main').show();
}

$(document).on({
	click: function() {
		$.post( 'http://bleau.fr/gps.php', { code: $('#code').val() })
		.done(function( data ) {
		    localStorage.setItem('code', data);
		    show();
		});

	}
}, '#submit');


$(document).on({
	click: function() {
	    localStorage.removeItem('code');
	    show();

	}
}, '#logout');

