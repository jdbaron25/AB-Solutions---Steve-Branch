Titanium.include('config.js');

//alert(Titanium.Platform.displayCaps.platformWidth);

var win = Ti.UI.currentWindow;
var applicationWin = Titanium.UI.createWindow({
    url:'window2.js',
    title:'Window 2',
});

var logo_fn=Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,'images/logo.jpg');
var logo=Titanium.UI.createImageView({
    image:logo_fn,
    top:10,
    left:10,
    width:161,
    height:72
});
win.add(logo);
var versionInfoLabel = Ti.UI.createLabel({
	color : '#000',
	font : {
		fontSize : Ti.App.fontSizes.f2
	},
	//text : 'Version '+ Ti.App.getVersion() +'   Host: '+Ti.App.credentials.url.host,
	text : Titanium.Platform.displayCaps.platformHeight + 'x' + Titanium.Platform.displayCaps.platformWidth + ' - ' + Titanium.Platform.displayCaps.dpi,
	bottom : 0,
	left : 0,
	textAlign:"right",
	width : 'auto',
	height : 'auto'
});
win.add(versionInfoLabel);

var label1 = Ti.UI.createLabel({
	color : '#900',
	font : {
		fontSize : Ti.App.fontSizes.f2
	},
	shadowColor : '#aaa',
	
	text : 'Mobile Survey App',
	textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
	top : '5%',
});

var userLabel = Ti.UI.createLabel({
	color : '#000000',
	font : {
		fontSize : Ti.App.fontSizes.f2
	},
	text : 'User Name',
	top : '20%',
	left : '10%',
	width : '30%',
	height : 'auto'
});

var userField = Titanium.UI.createTextField({
	top : '20%',
	right : '5%',
	color : '#000000',
	hintText : 'user name',
	hintTextColor : '#CCCCCC',
	width: '50%',
	borderWidth : 1,
	borderColor : '#CCCCCC',
	backgroundColor: 'transparent',
	font : {
		fontSize : '30',
	},
	keyboardType : Titanium.UI.KEYBOARD_EMAIL
});

var passLabel = Ti.UI.createLabel({
	color : '#000000',
	font : {
		fontSize : Ti.App.fontSizes.f2
	},
	text : 'Password',
	top : '30%',
	left : '10%',
	width : '30%',
	height : 'auto'
});

var passField = Titanium.UI.createTextField({
	width : '50%',
	top : '30%',
	right : '5%',
	color : '#000000',
	hintText : 'password',
	hintTextColor : '#CCCCCC',
	font : {
		fontSize : '30%'
	},
	passwordMask : 'true',
	borderColor : '#CCCCCC',
	backgroundColor: 'transparent',
});

var activity = Ti.UI.createActivityIndicator({
	color : 'blue',
	message : ' - Attempting Login',
	//top : 350,
	//left : 150,
	height : 20,
	width : 'auto'
});

var loginButton = Titanium.UI.createButton({
	title : 'Login',
	top : '40%',
	left : '10%',
	right : '10%',
	height : 'auto',
	color : '#000000',
	backgroundColor : '#669999',
	font : {
		fontSize : Ti.App.fontSizes.f2,
		fontWeight : 'bold',
	},
});

loginButton.addEventListener('click', function() {
	if (userField.value == "") {
		alert("User Name required for login");
		return;
	} else if (passField.value == "") {
		alert("Password required for login");
		return;
	} else {
		var parseCookie = '';
		var cookieValue = '';
		loginButton.enabled = false;
		activity.show();

		var userName = userField.value;
		var userPass = passField.value;

		var xhr = Titanium.Network.createHTTPClient();
		xhr.onerror = function(e) {
			Ti.API.error('Bad Sever =>' + e.error);
			alert("Error attempting to access server : " + e.error);
		};
		// alert(Ti.App.credentials.url.auth);
		console.log(Ti.App.credentials.url.auth);
		xhr.open("POST", Ti.App.credentials.url.auth, null);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("ABSOLDATASYNC_USERNAME", userName);
		xhr.setRequestHeader("ABSOLDATASYNC_PASSWORD", userPass);
		// xhr.send();
		xhr.onload = function() {
			if (this.status == '200') {
				var data = JSON.parse(this.responseText);
				console.log(this.responseText);
				// console.log(data);
				if (data.errors != undefined) {
					alert(data.errors[0]);
				} else {
					parseCookie = this.getResponseHeader("Set-Cookie");
					var firstPos = parseCookie.indexOf("ABSOLDATASYNC_TOKEN=");
					var token = parseCookie.substr(firstPos+20, 32);
					var conn = Titanium.Database.open('mysdb');
					//clear auth data
					conn.execute('DELETE FROM authData');
					//insert new auth data					
					conn.execute('INSERT INTO authData(userID, firstName, lastName, email, authToken) VALUES (?,?,?,?,?)', data.id, data.firstname, data.lastname, data.email, token);
					conn.close();
					console.log("***** ID = " + data.id + " - " + " TOKEN = " + token);
					alert("Login Success");
					//Add to credentials auth object.
					Ti.App.credentials.auth.loginUserID = data.id;
					Ti.App.credentials.auth.loginToken = token;
					Ti.App.credentials.user.firstName = data.firstname;
					Ti.App.credentials.user.lastName = data.lastname;
					Ti.App.credentials.user.email = data.email;
					applicationWin.open();
					win.close();
				}
			} else {
				alert('HTTP Error Response Status Code = ' + this.status);
				Ti.API.error("Error =>" + this.response);
			}
		};
		console.log("About to send...");
		xhr.send();
		activity.hide();
		loginButton.enabled = true;
	}
});

win.add(label1);
win.add(userLabel);
win.add(passLabel);
win.add(userField);
win.add(passField);
win.add(loginButton);
win.add(activity);