Titanium.include('db_install.js');
Titanium.include('auth_setup.js');

Titanium.UI.setBackgroundColor('#fff');

Ti.App.picker = Array();

if (Ti.App.credentials.auth.loginUserID == null || Ti.App.credentials.auth.loginToken == null) {
	var loginWin = Titanium.UI.createWindow({
		url : 'loginWindow.js',
		title : 'Window 1',
		backgroundColor : '#fff'
	});
	loginWin.open();
	
} else {
	var win2 = Titanium.UI.createWindow({
		url : 'window2.js',
		title : 'Mobile Survey Application',
	});

	win2.open();
}