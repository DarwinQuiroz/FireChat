// Initialize Firebase
var config = {
apiKey: "AIzaSyBcgmiocvONQaiq6SST0JXdGeJvtUj3m_I",
authDomain: "firechat-caa66.firebaseapp.com",
databaseURL: "https://firechat-caa66.firebaseio.com",
storageBucket: "firechat-caa66.appspot.com",
};
firebase.initializeApp(config);

var userName = document.getElementById('user-name');
var userImage = document.getElementById('user-pic');


function ingresoGoogle()
{
	if(!firebase.auth().currentUser)
	{
		var provider = new firebase.auth.GoogleAuthProvider();
		provider.addScope('https://www.googleapis.com/auth/plus.login');
		firebase.auth().signInWithPopup(provider).then(function(result){
			var token = result.credential.accessToken;
			var user = result.user;
			console.log(user);
			var name = result.user.displayName;
			$('#page').css('display', 'none') && $('page2').css('display', 'block');
			// document.querySelector('span.mdl-layout-title').textContent = "Bienvenido " + name;
		}).catch(function(error)
		{
			var errorCode = error.code;
			var errorMessage = error.message;
			var erroremail = error.email;
			var credential = error.credential;
			if(errorCode === 'auth/account-exists-with-different-credential')
			{
				alert('Es el mismo usuario');
			}
		});
	}
	else
	{
		firebase.auth().signOut();
	}
}

function ingresoFacebook()
{
	if(!firebase.auth().currentUser)
	{
		var provider = new firebase.auth.FacebookAuthProvider();
		provider.addScope('public_profile');
		firebase.auth().signInWithPopup(provider).then(function(result){
			var token = result.credential.accessToken;
			var user = result.user;
			// console.log(user);
			var name = result.user.displayName;
			$('#page').css('display', 'none') && $('page2').css('display', 'block');
			// document.querySelector('span.mdl-layout-title').textContent = "Bienvenido " + name;
		}).catch(function(error)
		{
			var errorCode = error.code;
			var errorMessage = error.message;
			var erroremail = error.email;
			var credential = error.credential;
			if(errorCode === 'auth/account-exists-with-different-credential')
			{
				alert('Es el mismo usuario');
			}
		});
	}
	else
	{
		firebase.auth().signOut();
	}
}

function inicializarFire()
{
	firebase.auth().onAuthStateChanged(function(user)
		{
			if(user)
			{
				var displayName = user.displayName;
				var userPhoto = user.photoURL;
				userName.textContent = displayName;
				userImage.style.backgroundImage = "url("+userPhoto+")";
			}
		});
}

window.onload = function()
{
	inicializarFire();
}

document.getElementById('btn-google').addEventListener('click', ingresoGoogle, false);
document.getElementById('btn-facebook').addEventListener('click', ingresoFacebook, false);