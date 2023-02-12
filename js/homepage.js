var login = document.querySelector('#login');

//
login.addEventListener('click', function(){
	var user = document.querySelector('#user-name').value;
	var pass = document.querySelector('#pass-word').value;
	
	//render data and pass to server with node.js
	console.log("user: " + user + " \npass: " + pass);
});

