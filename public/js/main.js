// Initialize Firebase
var config = {
apiKey: "AIzaSyBcgmiocvONQaiq6SST0JXdGeJvtUj3m_I",
authDomain: "firechat-caa66.firebaseapp.com",
databaseURL: "https://firechat-caa66.firebaseio.com",
storageBucket: "firechat-caa66.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();
var userConect = null;
var conectKey = "";
var cont_user = 0;

var userName = document.getElementById('user-name');
var userImage = document.getElementById('user-pic');
var userOnline = document.getElementById('cont-user');
document.getElementById('btn-google').addEventListener('click', ingresoGoogle, false);
document.getElementById('btn-facebook').addEventListener('click', ingresoFacebook, false);
document.getElementById('cerrar').addEventListener('click', eliminarUserDB, false);

// Iniciar Sesión con Google
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
			$('#page').css('display', 'none') && $('#page2').css('display', 'block');
			inicializarFire();
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

// Iniciar Sesión con Facebook
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
			$('#page').css('display', 'none') && $('#page2').css('display', 'block');
			inicializarFire();
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
				if(userPhoto)
				{
					userImage.style.backgroundImage = "url("+userPhoto+")";
				}
				else 
				{
					userImage.style.backgroundImage = "url(../img/profile_placeholder.png)";
				}
				userConect = database.ref("/user");
				agregarUserBD(user.uid,user.displayName);
				userConect.on('child_added', function(data){
					usuariosConectados(data.val().name, data.val().uid);
					console.log("Ha ingresado a la sala "+data.val().name);
				});
				userConect.on('child_remove', function(data){
					usuarioDesconectado(data.val().uid);
					console.log(data.val().name+" ha cerrado sesión");
				});
			}
		});
}

function agregarUserBD(uid,name)
{
  var conectado = userConect.push({
    uid:uid,
    name:name
  }); 
  conectKey = conectado.key;
}

function eliminarUserDB()
{
	database.ref("/user/"+conectKey).remove();
	$('#page2').css("display", "none") && $('#page').css("display", "block");
}

function usuariosConectados(name, uid)
{
	// var li = '<li id="'+uid+'" class="mdl-list__item"> <span class="mdl-list__item-primary-content>"'
	var li = '<li id="'+uid+'" class="mdl-list__item"><span class="mdl-list__item-primary-content"><i class="material-icons mdl-list__item-icon">person</li>'
			+name+'</span></li>';
	$('#user-online').append(li);
	cont_user += 1;
	userOnline.textContent = cont_user;
}

// window.onload = function()
// {
// 	inicializarFire();
// }

function usuarioDesconectado(uid)
{
	$('#'+uid).remove();
	cont_user -= 1;
	userOnline.textContent = cont_user;
}