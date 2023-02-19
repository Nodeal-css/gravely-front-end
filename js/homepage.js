var login = document.querySelector('#login');

//
login.addEventListener('click', async () => {
	var user = document.querySelector('#user-name').value;
	var pass = document.querySelector('#pass-word').value;
	
	//render data and pass to server with node.js
	//console.log("user: " + user + " \npass: " + pass);
	var arr = {
		"username": user,
		"password": pass
	}; 

	signin(arr).then( async () => {
		//redirect admin user to cemetery dashboard
		//load the cemetery information, map, to the admin end
		//study the functions in lib.js
		alert("correct username and password");
	}).catch((err) => {
		alert("Invalid usrename or password\nplease try again");
		window.location.href = 'index.html';
	});
});

